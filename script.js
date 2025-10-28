// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
    anchor.addEventListener('click', function(e){
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if(target) target.scrollIntoView({behavior:'smooth'});
    });
});

// Intersection Observer for scroll animations
const observer = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
        if(entry.isIntersecting){
            entry.target.classList.add('visible');
        } else {
            entry.target.classList.remove('visible'); // allows animation to re-trigger
        }
    });
},{threshold:0.1});
document.querySelectorAll('section').forEach(section=>observer.observe(section));

// Tooltip functionality
document.querySelectorAll('.tooltip').forEach(el=>{
    el.addEventListener('mouseenter',()=>{el.querySelector('.tooltiptext').style.opacity='1';});
    el.addEventListener('mouseleave',()=>{el.querySelector('.tooltiptext').style.opacity='0';});
});

// Copy Discord tag
document.getElementById('copyDiscord')?.addEventListener('click',()=>{
    navigator.clipboard.writeText('NotDimension#0001');
    const tooltip = document.querySelector('#copyDiscord .tooltiptext');
    tooltip.textContent='Copied!';
    setTimeout(()=>{tooltip.textContent='Copy to clipboard';},2000);
});

// External links open in new tab automatically
document.querySelectorAll('a').forEach(a=>{a.setAttribute('target','_blank');});
