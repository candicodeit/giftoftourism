<%
If not (Request.Form("txt_name") = "") Then

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
	objMail.From = Request.Form("txt_name") & " <" & Request.Form("txt_email") & ">"
	objMail.To =  "lscotti@boomyourbrand.com"
	objMail.Bcc = "bkurilko@boomyourbrand.com"
	objMail.Subject = "Gift of Tourism"
	objMail.textBody = "The following question/comment was submitted from the Gift of Tourism website." & vbCrLf & vbCrLf  & "From: " & Request.Form("txt_name") & " (" & Request.Form("txt_email") & ")" & vbCrLf & "Zip: " & Request.Form("txt_zip") & vbCrLf & vbCrLf & "Subject: " & Request.Form("txt_subject") & vbCrLf & "Message: " & Request.Form("txt_body")
	objMail.Fields.Update
	objMail.Send
	Set objMail = Nothing
	
	Response.Write("sent")

End If
%>