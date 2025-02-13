export function addMessage(message:any){
    var messagebox = document.getElementById("MessageBox");
    var messagetext = document.createElement("div");
    messagetext.innerHTML = message.message;
    messagetext.classList.add("messagetext")
    messagebox?.appendChild(messagetext);
    
    if(message.type == "success")
      messagetext.classList.add("successmessage")
    if(message.type == "warning")
      messagetext.classList.add("warningmessage")
    if(message.type == "failure")
      messagetext.classList.add("failuremessage")   
    
    setTimeout(() => {
      messagetext.remove();
    }, 5800);
}

