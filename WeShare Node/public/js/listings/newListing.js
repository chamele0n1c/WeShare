$(document).ready(function()
{
    const key = Cookies.get('apiauth');
	if (key != undefined)
	{
		const ele = document.getElementById('key');
		ele.setAttribute('value', key);
    }
    else
    {
        
		window.location.href="https://cyberbazaar.tk/member/login";
    }
});