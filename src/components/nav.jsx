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
  <span className="navbar-brand"><img style={{height: '45px', width: '45px', borderRadius: '50%', marginRight: '5px'}} src="https://s3.us-east-2.amazonaws.com/fetchappbucket/images/logo.jpg" /> HX Network <i className="fa fa-toggle-on ml-2" onClick={() => props.toggle()}></i></span>
    <div className="collapse navbar-collapse" id="navbarText">
                <span className="navbar-text">
                    {`Total Viewers: ${total}`}
                </span>
    </div>
</nav>
  )
};