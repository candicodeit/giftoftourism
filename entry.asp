<%
If not (Request.Form("txt_fname") = "") Then

	Dim objMail, objMailConf
	Set objMail = Server.CreateObject("CDO.Message")
	Set objMailConf = Server.CreateObject("CDO.Configuration")
	
	objMailConf.Fields.item("http://schemas.microsoft.com/cdo/configuration/sendusing") = 1
	objMailConf.Fields.item("http://schemas.microsoft.com/cdo/configuration/smtpserverpickupdirectory") = "c:\inetpub\mailroot\pickup"
	objMailConf.Fields.item("http://schemas.microsoft.com/cdo/configuration/smtpserver") = "http://localhost"
	objMailConf.Fields.item("http://schemas.microsoft.com/cdo/configuration/smtpserverport") = 25 
	objMailConf.Fields.item("http://schemas.microsoft.com/cdo/configuration/smtpconnectiontimeout") = 10
	objMailConf.Fields.Update 
	
	Set objMail.Configuration = objMailConf
	objMail.From = Request.Form("txt_fname") & " " & Request.Form("txt_lname") & " <" & Request.Form("txt_email_addr") & ">"
	objMail.To = Request.Form("email_recipient")
	objMail.Bcc = "candilanddesign@gmail.com"
	objMail.Subject = "Gift of Tourism Contest Entry Form"
	objMail.textBody = "The following contest entry was submitted from the Gift of Tourism website." & vbCrLf & vbCrLf & "Contest: " & Request.Form("contest_type") & vbCrLf & "Name: " & Request.Form("txt_fname") & " " & Request.Form("txt_lname") & vbCrLf & "Address: " & Request.Form("txt_address") & vbCrLf & Request.Form("txt_city") & ", " & Request.Form("select_state") & " " & Request.Form("txt_zip_code") & vbCrLf & "Phone: " & Request.Form("txt_phone") & vbCrLf & "Email: " & Request.Form("txt_email_addr") & vbCrLf & "Over 18: " & Request.Form("check_age") & vbCrLf & "Accept Terms: " & Request.Form("check_terms")
	objMail.Fields.Update
	objMail.Send
	Set objMail = Nothing
	
	Response.Write("sent")

End If
%>