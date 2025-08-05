let lastButton = null
let lastPage = null


window.addEventListener("load",  (e) => {
    OnClickButton(document.getElementById("Home"))
})

const OnClickButton = (button) => {
    if(lastButton)
        lastButton.classList.remove("active")

    button.classList.add("active")
    lastButton = button

    SwitchPage(button.innerText)
}

const SwitchPage = (page) => {

    page = document.getElementById(page + "-page")
    if(lastPage == page)
        return
    page.style.display = "flex"
    page.classList.add("openPage")
    page.style.zIndex  = 2

    if(lastPage){
        lastPage.classList.remove("openPage")
        lastPage.style.zIndex  = 1
        lastPage.style.display = "none"

    }

    lastPage = page
}