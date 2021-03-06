package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"math/rand"
	"net/http"
	"os"
	"runtime"
	"sort"
	"strconv"
	"sync"
	"time"

	"github.com/joho/godotenv"
	fisheryates "github.com/matttproud/fisheryates"
)

var wg sync.WaitGroup
var mykey string

var streamers = []Streamer{
	{Name: "Ice", ChannelId: "UCv9Edl_WbtbPeURPtFDo-uA"},
	{Name: "Hyphonix", ChannelId: "UCaFpm67qMk1W1wJkFhGXucA"},
	{Name: "Gary", ChannelId: "UCvxSwu13u1wWyROPlCH-MZg"},
	{Name: "Cxnews", ChannelId: "UCStEQ9BjMLjHTHLNA6cY9vg"},
	{Name: "SJC", ChannelId: "UC4YYNTbzt3X1uxdTCJaYWdg"},
	{Name: "Chilledcow", ChannelId: "UCSJ4gkVC6NrvII8umztf0Ow"},
	{Name: "Mixhound", ChannelId: "UC_jxnWLGJ2eQK4en3UblKEw"},
}
var resp []Newlive

func getCatalog(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-type", "application/json")
	rnd := rand.New(rand.NewSource(4))
	fisheryates.Shuffle(Random(streamers), rnd.Intn)
	b, err := json.Marshal(streamers)
	if err != nil {
		fmt.Println(err)
	}
	w.Write(b)
}

func sendStuff(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-type", "application/json")
	b, err := json.Marshal(resp)
	if err != nil {
		fmt.Println(err)
	}
	w.Write(b)
}

func init() {
	fmt.Println(runtime.NumCPU())
	ky := &mykey
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	*ky = os.Getenv("KEY")
}

func main() {
	fmt.Println("Server Started...")
	go getter()

	go func() {
		pollInterval := 35

		timerCh := time.Tick(time.Duration(pollInterval) * time.Minute)

		for range timerCh {
			getter()
		}
	}()
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./public/build/static/"))))

	http.HandleFunc("/streamers/all", getCatalog)
	http.HandleFunc("/streamers/live", sendStuff)

	//	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
	//		if r.URL.Path == "/manifest.json" || r.URL.Path == "/favicon.png" {
	//			str := fmt.Sprintf("./public/build/%v", r.URL.Path)
	//			http.ServeFile(w, r, str)
	//			return
	//		}
	//		http.ServeFile(w, r, "./public/build/index.html")
	//	})

	log.Fatal(http.ListenAndServe(":5000", nil))
}

func getter() {
	fmt.Println("getting....")
	ch := make(chan *Islive)
	go func() {
		defer close(ch)
		for _, v := range streamers {
			url := fmt.Sprintf("https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=%v&eventType=live&type=video&key=%v", v.ChannelId, mykey)
			resp, err := http.Get(url)
			if err != nil || resp.StatusCode != 200 {
				fmt.Println(err)
				continue
			}
			body, err := ioutil.ReadAll(resp.Body)
			if err != nil {
				fmt.Println(err)
			}
			var streamer Islive
			json.Unmarshal(body, &streamer)
			if streamer.PageInfo.TotalResults == 0 {
				continue
			}
			streamer.Name = v.Name
			ch <- &streamer
		}
	}()
	go func() {
		final := new([]Newlive)
		for v := range ch {
			if v == nil {
				fmt.Println("nil value")
				continue
			}
			id := v.Items[0].ID.VideoID
			resp, err := http.Get("https://www.googleapis.com/youtube/v3/videos?part=statistics%2C+snippet%2C+liveStreamingDetails&id=" + id + "&key=" + mykey)
			if err != nil || resp.StatusCode != 200 {
				fmt.Println(err)
				continue
			}
			body, err := ioutil.ReadAll(resp.Body)
			if err != nil {
				fmt.Println(err)
			}
			var live Livestream
			json.Unmarshal(body, &live)
			name, err := strconv.Atoi(live.Items[0].LiveStreamingDetails.ConcurrentViewers)
			if err != nil {
				fmt.Println(name)
				fmt.Println(err)
				continue
			}
			rz := Newlive{
				Name:        v.Name,
				ChannelID:   live.Items[0].Snippet.ChannelID,
				Title:       live.Items[0].Snippet.Title,
				Description: live.Items[0].Snippet.Description,
				Viewers:     name,
				Likes:       live.Items[0].Statistics.LikeCount,
				Dislikes:    live.Items[0].Statistics.DislikeCount,
				VideoID:     live.Items[0].ID,
			}
			*final = append(*final, rz)
		}
		resp = *final
		sort.Sort(ByViewers(resp))
	}()
}
