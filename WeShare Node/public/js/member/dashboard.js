$(document).ready(function()
{
    const usrnom = Cookies.get('usrnom');
	if (usrnom != undefined)
	{
		let nomstag = document.getElementsByClassName('usrnom');
		for (i=0; i < nomstag.length; i++)
		{
			nomstag[i].innerHTML = usrnom;
		}
    }
    else
    {
        let nomstag = document.getElementsByClassName('usrnom');
		for (i=0; i < nomstag.length; i++)
		{
			window.location.href="https://cyberbazaar.tk/member/login";
		}
    }
});