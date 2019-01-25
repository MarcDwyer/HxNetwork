import React from 'react'


export const Navbar = (props) => {
  const darkTheme = props.theme ? 'darkTheme' : 'whiteTheme';
    const total = !props.live ? '0' : Object.values(props.live).reduce((total, item) => {
        if (isNaN(item).viewers) {
            return;
        }
        total += item.Viewers;
        return total
    }, 0)
  return (
<nav className={`navbar navbar-expand-lg ${darkTheme}`}>
  <span className="navbar-brand">FetcherApp <i className="fa fa-toggle-on ml-2" onClick={() => props.toggle()}></i></span>
    <div className="collapse navbar-collapse" id="navbarText">
                <span className="navbar-text">
                    {`Total Viewers: ${total}`}
                </span>
    </div>
</nav>
  )
};