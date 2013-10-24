module.exports = function(model) {
    return div([
        a({href: "/"}, "Home"),
        div(bootstrap.nav(["Home","About","Contact"],"About"))
    ]);
    /*
            "a[href=/]": "Home",
            "div": bootstrap.nav(["Home","About","Contact"])
        }
    }
    */
};