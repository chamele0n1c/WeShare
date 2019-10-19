
    

$(document).ready(function()
{
    const usrnom = Cookies.get('usrnom');
    if (usrnom != null && usrnom != undefined)
    {
        const nomstag = document.getElementById('usrimg');
		nomstag.setAttribute('title', usrnom);
        $('[data-toggle="tooltip"]').tooltip();
    }
    else
    {
        const nomstag = document.getElementById('usrimg');
		nomstag.setAttribute('title', 'Guest');
        $('[data-toggle="tooltip"]').tooltip();
    }
});