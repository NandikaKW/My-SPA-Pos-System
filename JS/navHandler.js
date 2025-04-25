document.addEventListener("DOMContentLoaded",function (){
const navLinks=document.querySelectorAll('.nav-link');
const sections=document.querySelectorAll('main.page')

    navLinks.forEach(link=>{
        link.addEventListener('click',function (e){
            e.preventDefault();
            const targetId=this.getAttribute('href').substring(1);

            sections.forEach(sections=>{
                sections.style.display='none';
            })

            const targetSection=document.getElementById(targetId);
            if (targetSection){
                targetSection.style.display='block';
            }
        })
    })
})
