let taxswitch=document.getElementById("flexSwitchCheckReverse")
taxswitch.addEventListener("click",()=>{
taxinfo=document.getElementsByClassName("taxInfo");
for(info of taxinfo){
    if(info.style.display!="inline"){
        info.style.display="inline";
    }
    else{
         info.style.display="None";
    }

}
});
