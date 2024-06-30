const outputDiv = document.getElementById("output");

const output = (text, replaceContent) => {
    let newText = "";
    if(!replaceContent){
        newText = outputDiv.innerHTML+"<br>";
    }
    newText += text;
    outputDiv.innerHTML = newText;
}

export {output}