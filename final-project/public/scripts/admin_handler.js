function view(obj) {
    $.ajax({
        "url": $(obj).attr("data"),
        "type": "GET",
        "success": getSuccess,
        "error": getFailed
    });
}

function getSuccess(data) {
    $("div[name='data_screen']").html(data);
}

function getFailed(xhr, status, exception) {
    console.log(xhr, status, exception);
}

function highlight(obj) {
    $(obj).css("background-color", "rgb(125, 255, 200)")
}

function unHigh(obj) {
    $(obj).css("background-color", $(obj).parent().css("background-color"))
}

function toInput(obj) {
    let inputText = $(obj).html().trim().replace("'", "&#39").replace('"', "&quot")
    $(obj).before("<input style='height: 40px;width: 500px;' type='text' name='" + $(obj).attr("name") + "' onmouseleave='toData(this)' value='" + inputText + "'>")
    $(obj).remove()
}

function toData(obj) {
    $(obj).before("<div name='" + $(obj).attr("name") + "'  ondblclick='toInput(this)'>" + $(obj).val() + "</div>")
    $(obj).remove()
}

function saveMenu(obj) {
    let parent = $(obj).parent().parent()
    let productId = parent.attr("id").split("_")[1]
    if (productId === 'new') {
        let type = parent.children($("div[name='attributes']")).children("select[name='food_type']").val()
        let body = {
            type: type,
            img: parent.children("div[name='img']").children().attr("src"),
            title: parent.children("div[name='attributes']").children("div[name='title']").html().trim(),
            description: parent.children("div[name='attributes']").children("div[name='description']").html().trim(),
            price: parseFloat(parent.children("div[name='attributes']").children("div[name='price']").html().trim()),
            isPopular: false
        }
        console.log("Add new food: ", body);
        $.ajax({
            "url": "update_menu",
            "type": "POST",
            "data": body
        });
    } else {
        let type = parent.children().children().eq(2).html().trim().split("\n")[1].trim()
        console.log(type)
        let body = {
            type: type,
            id: parent.attr("id").split("_")[1],
            img: parent.children("div[name='img']").children().attr("src"),
            title: parent.children("div[name='attributes']").children("div[name='title']").html().trim(),
            description: parent.children("div[name='attributes']").children("div[name='description']").html().trim(),
            price: parseFloat(parent.children("div[name='attributes']").children("div[name='price']").html().trim())
        }
        console.log("Update menu data: ", body);
        $.ajax({
            "url": "update_menu",
            "type": "POST",
            "data": body
        });
    }

}

function displayImage(obj) {
    // Get the file input element
    let parent = $(obj).parent().parent()
    const fileInput = document.getElementById(parent.attr("id") + "_img");
    let targetSet = parent.children("div[name='img']").children()[0]

    // Create a FormData object and append the file
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    // Make a POST request using the Fetch API
    fetch('new_menu_image', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            // Handle the response from the server
            console.log('Server response:', data);
            setNewImg(targetSet, data.filename);
        })
        .catch(error => console.error('Error:', error));
}

function setNewImg(context, data) {
    $(context).attr("src", "../../img/" + data)
}

function generateNewMenu() {
    let html = `<div class="menu_present" id="food_new">
    <div name="img">
        <img src="../img/classic-cheese-pizza-recipe-2-64429a0cb408b.jpg" alt="pizza_img" width="200px" height="200px">
        <input type='file' id="food_new_img" accept="image/*" onchange="displayImage(this)">
    </div>
    <div name="attributes">
        Food Type:
        <select name='food_type'>
            <option value='pizza'>Pizza</option>
            <option value='starter'>Starter</option>
            <option value='salad'>Salad</option>
        </select>
        <div ondblclick="toInput(this)" name="title">
            default title
        </div>
        <div ondblclick="toInput(this)" name="description">
            default description
        </div>
        <div ondblclick="toInput(this)" name="price">
            0 $</div>
        <button onclick="saveMenu(this)">Save</button>
    </div>
</div>`;
    $("div[name='admin_menu_table']").append(html)
}