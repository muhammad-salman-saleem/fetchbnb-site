import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'
import sgMail from '@sendgrid/mail'


const prisma = new PrismaClient()

type Data = any
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

//city, zip_code, adddress, bedrooms, bathrooms, state
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method !== 'POST') {
        return res.status(400).json({ name: 'Bad Request' })
    }
    try {
        if (!req.body) return res.status(404).json({ error: "No form data" })
        const { email, password } = req.body
        if (email.length > 1000) return res.status(203).json({ error: "Email too long" });
        //check duplicate user
        const checkExisting = await prisma.user.findFirst({
            where: {
                email: email.toLowerCase()
            }
        })
        if (checkExisting) return res.status(203).json({ error: "User already exists" });

        // hash password
        const user = await prisma.user.create({
            data: {
                email: email.toLowerCase(),
                password: await hash(password, 12),
            }
        })

        const msg = {
            to: email.toLowerCase(), // Change to your recipient
            from: 'support@fetchit.ai', // Change to your verified sender
            subject: 'Fetchit.ai | Welcome!',
            text: 'Fetchit.ai | Welcome!',
            html: `
            <div>
            <div align="center">
<table border="0" cellspacing="0" cellpadding="0" style="max-width:495.0pt;box-sizing:border-box">
<tbody>
<tr>
<td valign="top" style="padding:0in 0in 0in 0in;box-sizing:border-box">
<table border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100.0%;background-size:cover">
<tbody>
<tr>
<td width="100%" valign="top" style="width:100.0%;background:white;padding:0in 0in 0in 0in">
<table border="0" cellspacing="0" cellpadding="0" width="660" id="m_1007685915535248593x_x_m_-4447317766140722551x_x_tableSelected0" style="width:495.0pt;background-size:cover">
<tbody>
<tr style="height:130.4pt">
<td width="660" valign="top" style="width:495.0pt;padding:9.0pt .25in 9.0pt .25in;height:130.4pt">
<p align="center" style="margin:0in;font-size:10pt;font-family:Calibri,sans-serif;text-align:center">
<a href="https://urldefense.proofpoint.com/v2/url?u=https-3A__us21.mailchimp.com_mctx_clicks-3Furl-3Dhttps-253A-252F-252Fwww.fetchit.ai-252F-26xid-3Ddbacefff81-26uid-3D185379898-26iid-3D642216fdd4-26pool-3Dcts-26v-3D2-26c-3D1672354142-26h-3Da39caa822b876293cb17c02f39e339b69e67868f0beed82e7c939c25e42ff5e8&amp;d=DwMFAw&amp;c=euGZstcaTDllvimEN8b7jXrwqOf-v5A_CdpgnVfiiMM&amp;r=jbW_cC1jRnTUjRd6O9xJnTb8fAvJFEfU7s2uS_REML4&amp;m=MDPDTra4NmpvGBburXe2dovf4zvz4FB5EhxSDJhFUcw&amp;s=eNVIZ52mdu1xi2VKFrBX2A-WKMoAVi2m_RVEJc31fYc&amp;e=" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://urldefense.proofpoint.com/v2/url?u%3Dhttps-3A__us21.mailchimp.com_mctx_clicks-3Furl-3Dhttps-253A-252F-252Fwww.fetchit.ai-252F-26xid-3Ddbacefff81-26uid-3D185379898-26iid-3D642216fdd4-26pool-3Dcts-26v-3D2-26c-3D1672354142-26h-3Da39caa822b876293cb17c02f39e339b69e67868f0beed82e7c939c25e42ff5e8%26d%3DDwMFAw%26c%3DeuGZstcaTDllvimEN8b7jXrwqOf-v5A_CdpgnVfiiMM%26r%3DjbW_cC1jRnTUjRd6O9xJnTb8fAvJFEfU7s2uS_REML4%26m%3DMDPDTra4NmpvGBburXe2dovf4zvz4FB5EhxSDJhFUcw%26s%3DeNVIZ52mdu1xi2VKFrBX2A-WKMoAVi2m_RVEJc31fYc%26e%3D&amp;source=gmail&amp;ust=1674094411833000&amp;usg=AOvVaw0XbYUa9pffIEKxU7Vx3d5y"><span style="font-size:11.0pt;color:windowtext;text-decoration:none"><span style="color:blue"><img border="0" width="353" id="m_1007685915535248593x_x_m_-4447317766140722551_x005f_x0000_i1029" alt="Logo" style="width:3.677in" src="https://ci4.googleusercontent.com/proxy/0DBiRXI1NJI_azOkpVFa9UKlkUtLczVxaG9kb9l_-FHvupSalLbzdytP4lub-cKNPl0w1AE1pieNR37_trD_fMO4W9QVTIHXxU8H3i6oLv3Xc24ukQ14S88OVUJq3UxTkE7pH8KyK9pUMGIgZWTwtVdVrFIa0aayZo3CN3nNpHfN_SSZqAS3M_0=s0-d-e1-ft#https://dim.mcusercontent.com/cs/29f82d1e9146761d462d377dd/images/d9e55da5-6713-5ef2-907c-3407a200468e.jpg?w=354&amp;dpr=2" class="CToWUd" data-bit="iit"></span></span></a><span style="font-size:11.0pt"></span></p>
</td>
</tr>
<tr style="height:372.3pt">
<td width="660" valign="top" style="width:495.0pt;padding:9.0pt .25in 9.0pt .25in;height:372.3pt;box-sizing:border-box">
<h1 align="center" style="margin-right:0in;margin-left:0in;font-size:24pt;font-family:Calibri,sans-serif;font-weight:bold;text-align:center">
<span style="font-family:&quot;Arial&quot;,sans-serif;color:#5271ff">Welcome!</span></h1>
<div>
<p style="text-align:justify"><span style="color:rgb(29,28,29);font-family:Calibri,Helvetica,sans-serif">Hey Fetchit Fam,</span></p>
<p style="text-align:justify"><span style="color:#1d1c1d"><br>
</span></p>
<p style="text-align:justify"><span style="font-family:Calibri,Helvetica,sans-serif">From the bottom of my heart thank</span><span style="color:rgb(36,36,36);font-family:Calibri,Helvetica,sans-serif"> you so much for joining Fetchit.</span><span style="font-family:Calibri,Helvetica,sans-serif">
 </span><span style="color:rgb(36,36,36);font-family:Calibri,Helvetica,sans-serif">.
</span><span style="font-family:Calibri,Helvetica,sans-serif">I put my blood, sweat, and tears into this and to see everyone resonate with our software means the world to me.</span></p>
<p style="text-align:justify"><span style="font-family:Calibri,Helvetica,sans-serif"></span></p>
<p style="text-align:justify"><span style="color:rgb(36,36,36);font-family:Calibri,Helvetica,sans-serif">Below are
</span><span style="color:black;background:yellow;font-family:Calibri,Helvetica,sans-serif">INSTRUCTIONS</span><span style="color:rgb(36,36,36);font-family:Calibri,Helvetica,sans-serif"> for
</span><span style="font-family:Calibri,Helvetica,sans-serif">activating</span><span style="color:rgb(36,36,36);font-family:Calibri,Helvetica,sans-serif"> your account:</span></p>
<p style="text-align:justify"><span style="font-family:Calibri,Helvetica,sans-serif">&nbsp;</span></p>
<div>
<p style="margin:0in;font-size:10pt;font-family:Calibri,sans-serif;text-align:justify">
<span style="font-size:11pt;font-family:Calibri,Helvetica,sans-serif">1. Go to </span>
<span style="font-size:11.0pt"><a href="https://urldefense.proofpoint.com/v2/url?u=http-3A__Fetchit.ai&amp;d=DwMFaQ&amp;c=euGZstcaTDllvimEN8b7jXrwqOf-v5A_CdpgnVfiiMM&amp;r=jbW_cC1jRnTUjRd6O9xJnTb8fAvJFEfU7s2uS_REML4&amp;m=aJF9WfaOpy3n-wYwqbo5BzkXyfqneAi2J2_7I-kwjMw&amp;s=5vWa--Zy2xjv7mVnVbG7IdK1d06MrKs6QOsIlKZZTWo&amp;e=" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://urldefense.proofpoint.com/v2/url?u%3Dhttp-3A__Fetchit.ai%26d%3DDwMFaQ%26c%3DeuGZstcaTDllvimEN8b7jXrwqOf-v5A_CdpgnVfiiMM%26r%3DjbW_cC1jRnTUjRd6O9xJnTb8fAvJFEfU7s2uS_REML4%26m%3DaJF9WfaOpy3n-wYwqbo5BzkXyfqneAi2J2_7I-kwjMw%26s%3D5vWa--Zy2xjv7mVnVbG7IdK1d06MrKs6QOsIlKZZTWo%26e%3D&amp;source=gmail&amp;ust=1674094411834000&amp;usg=AOvVaw00uy9W-VzYpbSFH_sf4JSP"><span style="font-family:Calibri,Helvetica,sans-serif">Fetchit.ai</span></a></span><span style="font-size:11pt;font-family:Calibri,Helvetica,sans-serif">
 and click </span><span style="font-size:11pt;font-family:Calibri,Helvetica,sans-serif"><b>Login.
</b></span><span style="font-size:11pt;font-family:Calibri,Helvetica,sans-serif">We recommend using a computer when verifying your account</span></p>
<div>
<p style="margin:0in;font-size:10pt;font-family:Calibri,sans-serif;text-align:justify">
<span style="font-size:11pt;font-family:Calibri,Helvetica,sans-serif">2. Enter your email and a password.</span></p>
</div>
<p style="margin:0in;font-size:10pt;font-family:Calibri,sans-serif;text-align:justify">
<span style="font-size:11pt;font-family:Calibri,Helvetica,sans-serif">3. Start browsing!
</span></p>
</div>
<div>
<p style="margin:0in;font-size:10pt;font-family:Calibri,sans-serif;text-align:justify">
<span style="font-size:11pt;font-family:Calibri,Helvetica,sans-serif">&nbsp;</span></p>
</div>
<div>
<p style="margin:0in;font-size:10pt;font-family:Calibri,sans-serif;text-align:justify">
<span style="font-size:11pt;font-family:Calibri,Helvetica,sans-serif">..and voila! You can now start your journey to your dream STR property!</span></p>
</div>
<p style="text-align:justify"><span style="font-family:Calibri,Helvetica,sans-serif">&nbsp;</span></p>
<p style="text-align:justify"><span style="color:rgb(36,36,36);font-family:Calibri,Helvetica,sans-serif">If you want to
</span><span style="color:rgb(36,36,36);font-family:Calibri,Helvetica,sans-serif"><b>book time with me</b></span><span style="font-family:Calibri,Helvetica,sans-serif"><b> on zoom</b></span><b><span style="color:rgb(36,36,36);font-family:Calibri,Helvetica,sans-serif">
</span></b><span style="color:rgb(36,36,36);font-family:Calibri,Helvetica,sans-serif">to get comfortable using the software, please click on the link below:&nbsp;&nbsp;</span><a href="https://urldefense.proofpoint.com/v2/url?u=https-3A__calendly.com_yonatanwaxman_30min&amp;d=DwMFAw&amp;c=euGZstcaTDllvimEN8b7jXrwqOf-v5A_CdpgnVfiiMM&amp;r=jbW_cC1jRnTUjRd6O9xJnTb8fAvJFEfU7s2uS_REML4&amp;m=MDPDTra4NmpvGBburXe2dovf4zvz4FB5EhxSDJhFUcw&amp;s=S3dDN9ZRL_sYsBPqKu6c5ZumXzrzsJ_XeKocIdjc6Mg&amp;e=" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://urldefense.proofpoint.com/v2/url?u%3Dhttps-3A__calendly.com_yonatanwaxman_30min%26d%3DDwMFAw%26c%3DeuGZstcaTDllvimEN8b7jXrwqOf-v5A_CdpgnVfiiMM%26r%3DjbW_cC1jRnTUjRd6O9xJnTb8fAvJFEfU7s2uS_REML4%26m%3DMDPDTra4NmpvGBburXe2dovf4zvz4FB5EhxSDJhFUcw%26s%3DS3dDN9ZRL_sYsBPqKu6c5ZumXzrzsJ_XeKocIdjc6Mg%26e%3D&amp;source=gmail&amp;ust=1674094411834000&amp;usg=AOvVaw1avhLvcYYHeLAOJ4Tc8iQ3"><span style="font-family:Calibri,Helvetica,sans-serif">https://calendly.com/<wbr>yonatanwaxman/30min</span></a></p>
<p style="text-align:justify"><span style="font-family:Calibri,Helvetica,sans-serif">&nbsp;</span></p>
<p style="text-align:justify"><span style="font-family:Calibri,Helvetica,sans-serif">&nbsp;</span></p>
<p style="text-align:justify;background:white"><span><span style="color:rgb(29,28,29);font-family:Calibri,Helvetica,sans-serif">Happy hosting!</span></span></p>
<p style="margin:0in;font-size:10pt;font-family:Calibri,sans-serif;text-align:justify">
<span style="font-size:11.0pt">&nbsp;</span></p>
</div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
<tr style="height:16.15pt">
<td width="660" valign="top" style="width:495.0pt;padding:0in 0in 0in 0in;height:16.15pt;box-sizing:border-box">
</td>
</tr>
<tr style="height:7.15pt">
<td width="660" valign="top" style="width:495.0pt;padding:9.0pt 0in 9.0pt 0in;height:7.15pt;box-sizing:border-box">
</td>
</tr>
<tr style="height:34.15pt">
<td width="660" valign="top" style="width:495.0pt;padding:9.0pt .25in 9.0pt .25in;height:34.15pt;box-sizing:border-box">
</td>
</tr>
<tr style="height:31.5pt">
<td width="660" valign="top" style="width:495.0pt;padding:15.0pt .25in 15.0pt .25in;height:31.5pt;box-sizing:border-box">
<table border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100.0%">
<tbody>
<tr>
<td valign="top" style="border:none;border-top:solid black 1.5pt;padding:0in 0in 0in 0in">
</td>
</tr>
</tbody>
</table>
</td>
</tr>
<tr style="height:84.0pt">
<td width="660" valign="top" style="width:495.0pt;padding:9.0pt 0in 9.0pt 0in;height:84.0pt;box-sizing:border-box">
<div align="center">
<table border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100.0%;background-size:cover">
<tbody>
<tr>
<td valign="top" style="padding:0in 0in 0in 0in;background-size:cover">
<table border="0" cellspacing="24" cellpadding="0" width="100%" style="width:100.0%;background-size:cover">
<tbody>
<tr>
<td width="100%" valign="top" style="width:100.0%;padding:0in 0in 0in 0in">
<table border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100.0%">
<tbody>
<tr>
<td valign="top" style="padding:0in 0in 0in 0in">
<div align="center">
<table border="0" cellspacing="0" cellpadding="0" width="0">
<tbody>
<tr>
<td valign="top" style="padding:0in .25in 0in .25in">
<p style="margin:0in;font-size:10pt;font-family:Calibri,sans-serif">
<a href="https://urldefense.proofpoint.com/v2/url?u=https-3A__us21.mailchimp.com_mctx_clicks-3Furl-3Dhttps-253A-252F-252Fwww.facebook.com-252Fprofile.php-253Fid-253D100088403795350-26xid-3Ddbacefff81-26uid-3D185379898-26iid-3D642216fdd4-26pool-3Dcts-26v-3D2-26c-3D1672354142-26h-3D20f4c3c193a4a5e05b60635241d225e860509f60129073a73155422e6fde7a2c&amp;d=DwMFAw&amp;c=euGZstcaTDllvimEN8b7jXrwqOf-v5A_CdpgnVfiiMM&amp;r=jbW_cC1jRnTUjRd6O9xJnTb8fAvJFEfU7s2uS_REML4&amp;m=MDPDTra4NmpvGBburXe2dovf4zvz4FB5EhxSDJhFUcw&amp;s=H0akBWnCmie9S4EOZihW63VqAfT8Dr1Cj44TaykFTO0&amp;e=" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://urldefense.proofpoint.com/v2/url?u%3Dhttps-3A__us21.mailchimp.com_mctx_clicks-3Furl-3Dhttps-253A-252F-252Fwww.facebook.com-252Fprofile.php-253Fid-253D100088403795350-26xid-3Ddbacefff81-26uid-3D185379898-26iid-3D642216fdd4-26pool-3Dcts-26v-3D2-26c-3D1672354142-26h-3D20f4c3c193a4a5e05b60635241d225e860509f60129073a73155422e6fde7a2c%26d%3DDwMFAw%26c%3DeuGZstcaTDllvimEN8b7jXrwqOf-v5A_CdpgnVfiiMM%26r%3DjbW_cC1jRnTUjRd6O9xJnTb8fAvJFEfU7s2uS_REML4%26m%3DMDPDTra4NmpvGBburXe2dovf4zvz4FB5EhxSDJhFUcw%26s%3DH0akBWnCmie9S4EOZihW63VqAfT8Dr1Cj44TaykFTO0%26e%3D&amp;source=gmail&amp;ust=1674094411834000&amp;usg=AOvVaw0XYw3yBDsFNlwyj1EHRQnJ"><span style="font-size:11.0pt;color:windowtext;text-decoration:none"><span style="color:blue"><img border="0" width="40" id="m_1007685915535248593x_x_m_-4447317766140722551_x005f_x0000_i1028" alt="Facebook icon" style="width:.4166in" src="https://ci4.googleusercontent.com/proxy/2C4nstkK26T2RDmu3tTvChuYQ0blyvWEO0rRGxXDm6JcY4DaTTCP3fyDhfg8s0MqfcwANTYITwwnNuPzVnZgvOm211lvRZyOz-wmQE7T2hKgGK9tuZeXG2csJ2gr5uUobh9dy5iG-CoETCq3EM0bjVx0LBf_OC0ULTgtj6BNj6CwLTHP_laFEG5HPHC9p8MSkxTOao-8JcAXK3T9UD3n1LgrSjA=s0-d-e1-ft#https://dim.mcusercontent.com/https/cdn-images.mailchimp.com%2Ficons%2Fsocial-block-v3%2Fblock-icons-v3%2Ffacebook-filled-dark-40.png?w=40&amp;dpr=2" class="CToWUd" data-bit="iit"></span></span></a><span style="font-size:11.0pt"></span></p>
</td>
<td valign="top" style="padding:0in .25in 0in .25in">
<p style="margin:0in;font-size:10pt;font-family:Calibri,sans-serif">
<a href="https://urldefense.proofpoint.com/v2/url?u=https-3A__us21.mailchimp.com_mctx_clicks-3Furl-3Dhttps-253A-252F-252Finstagram.com-252Ffetchit.ai-253Figshid-253DZjc2ZTc4Nzk-253D-26xid-3Ddbacefff81-26uid-3D185379898-26iid-3D642216fdd4-26pool-3Dcts-26v-3D2-26c-3D1672354142-26h-3Df5a762526f8e7ac54eee02636b784b155071f695589014a1cd28b869c4c3fc07&amp;d=DwMFAw&amp;c=euGZstcaTDllvimEN8b7jXrwqOf-v5A_CdpgnVfiiMM&amp;r=jbW_cC1jRnTUjRd6O9xJnTb8fAvJFEfU7s2uS_REML4&amp;m=MDPDTra4NmpvGBburXe2dovf4zvz4FB5EhxSDJhFUcw&amp;s=9onZ8mdNBDd9DJwAWpYgO1SmwPg-igY86oF_a_PDdiU&amp;e=" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://urldefense.proofpoint.com/v2/url?u%3Dhttps-3A__us21.mailchimp.com_mctx_clicks-3Furl-3Dhttps-253A-252F-252Finstagram.com-252Ffetchit.ai-253Figshid-253DZjc2ZTc4Nzk-253D-26xid-3Ddbacefff81-26uid-3D185379898-26iid-3D642216fdd4-26pool-3Dcts-26v-3D2-26c-3D1672354142-26h-3Df5a762526f8e7ac54eee02636b784b155071f695589014a1cd28b869c4c3fc07%26d%3DDwMFAw%26c%3DeuGZstcaTDllvimEN8b7jXrwqOf-v5A_CdpgnVfiiMM%26r%3DjbW_cC1jRnTUjRd6O9xJnTb8fAvJFEfU7s2uS_REML4%26m%3DMDPDTra4NmpvGBburXe2dovf4zvz4FB5EhxSDJhFUcw%26s%3D9onZ8mdNBDd9DJwAWpYgO1SmwPg-igY86oF_a_PDdiU%26e%3D&amp;source=gmail&amp;ust=1674094411834000&amp;usg=AOvVaw3084FlPawndPVLCFjkjU6r"><span style="font-size:11.0pt;color:windowtext;text-decoration:none"><span style="color:blue"><img border="0" width="40" id="m_1007685915535248593x_x_m_-4447317766140722551_x005f_x0000_i1027" alt="Instagram icon" style="width:.4166in" src="https://ci5.googleusercontent.com/proxy/L1PruRK3XrUtsAIkqJKuDy4YRWY8o0bk6-MY2GMjx3GR6Wx-eYNoiNqYwhssh71xnb86J21Wwbt0Mz6zzFOpoA3e47thmRS0vygmrJ3Rsb0yLLdwd55XmbzM-Pa9Up91GKpsDKissACYIaoPi9cmer2zyOEmykhanWY34YFFUdccKCye6y5_8W6WAg09OwWA69oxTaLZ5Hw68glVUPGkB99rh368=s0-d-e1-ft#https://dim.mcusercontent.com/https/cdn-images.mailchimp.com%2Ficons%2Fsocial-block-v3%2Fblock-icons-v3%2Finstagram-filled-dark-40.png?w=40&amp;dpr=2" class="CToWUd" data-bit="iit"></span></span></a><span style="font-size:11.0pt"></span></p>
</td>
</tr>
</tbody>
</table>
</div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</div>
</td>
</tr>
<tr style="height:194.55pt">
<td width="660" valign="top" style="width:495.0pt;padding:6.0pt 6.0pt 6.0pt 6.0pt;height:194.55pt;box-sizing:border-box">
<div align="center">
<table border="0" cellspacing="0" cellpadding="0" width="100%" id="m_1007685915535248593x_x_m_-4447317766140722551x_x_x_m_5969517929406669074m_3148892069515808532m_8662126936939390812m_-2320449114205819970section_239bb409215c47c01e16c9cc2980f3da" style="width:100.0%">
<tbody>
<tr>
<td valign="top" style="padding:0in 0in 0in 0in">
<table border="0" cellspacing="12" cellpadding="0" width="100%" style="width:100.0%;background-size:cover">
<tbody>
<tr>
<td width="100%" valign="top" style="width:100.0%;padding:0in 0in 0in 0in">
<table border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100.0%;background-size:cover">
<tbody>
<tr>
<td valign="top" style="padding:9.0pt 0in 9.0pt 0in">
<p align="center" style="margin:0in;font-size:10pt;font-family:Calibri,sans-serif;text-align:center">
<a href="https://urldefense.proofpoint.com/v2/url?u=https-3A__us21.mailchimp.com_mctx_clicks-3Furl-3Dhttps-253A-252F-252Fwww.fetchit.ai-252F-26xid-3Ddbacefff81-26uid-3D185379898-26iid-3D642216fdd4-26pool-3Dcts-26v-3D2-26c-3D1672354142-26h-3Da39caa822b876293cb17c02f39e339b69e67868f0beed82e7c939c25e42ff5e8&amp;d=DwMFAw&amp;c=euGZstcaTDllvimEN8b7jXrwqOf-v5A_CdpgnVfiiMM&amp;r=jbW_cC1jRnTUjRd6O9xJnTb8fAvJFEfU7s2uS_REML4&amp;m=MDPDTra4NmpvGBburXe2dovf4zvz4FB5EhxSDJhFUcw&amp;s=eNVIZ52mdu1xi2VKFrBX2A-WKMoAVi2m_RVEJc31fYc&amp;e=" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://urldefense.proofpoint.com/v2/url?u%3Dhttps-3A__us21.mailchimp.com_mctx_clicks-3Furl-3Dhttps-253A-252F-252Fwww.fetchit.ai-252F-26xid-3Ddbacefff81-26uid-3D185379898-26iid-3D642216fdd4-26pool-3Dcts-26v-3D2-26c-3D1672354142-26h-3Da39caa822b876293cb17c02f39e339b69e67868f0beed82e7c939c25e42ff5e8%26d%3DDwMFAw%26c%3DeuGZstcaTDllvimEN8b7jXrwqOf-v5A_CdpgnVfiiMM%26r%3DjbW_cC1jRnTUjRd6O9xJnTb8fAvJFEfU7s2uS_REML4%26m%3DMDPDTra4NmpvGBburXe2dovf4zvz4FB5EhxSDJhFUcw%26s%3DeNVIZ52mdu1xi2VKFrBX2A-WKMoAVi2m_RVEJc31fYc%26e%3D&amp;source=gmail&amp;ust=1674094411834000&amp;usg=AOvVaw3PpRwHV0qw_-QIUwIv_95N"><span style="font-size:11.0pt;color:windowtext;text-decoration:none"><span style="color:blue"><img border="0" width="353" id="m_1007685915535248593x_x_m_-4447317766140722551_x005f_x0000_i1026" alt="Logo" style="width:3.677in" src="https://ci4.googleusercontent.com/proxy/0DBiRXI1NJI_azOkpVFa9UKlkUtLczVxaG9kb9l_-FHvupSalLbzdytP4lub-cKNPl0w1AE1pieNR37_trD_fMO4W9QVTIHXxU8H3i6oLv3Xc24ukQ14S88OVUJq3UxTkE7pH8KyK9pUMGIgZWTwtVdVrFIa0aayZo3CN3nNpHfN_SSZqAS3M_0=s0-d-e1-ft#https://dim.mcusercontent.com/cs/29f82d1e9146761d462d377dd/images/d9e55da5-6713-5ef2-907c-3407a200468e.jpg?w=354&amp;dpr=2" class="CToWUd" data-bit="iit"></span></span></a><span style="font-size:11.0pt"></span></p>
</td>
</tr>
<tr>
<td valign="top" style="padding:9.0pt 12.0pt 9.0pt 12.0pt"></td>
</tr>
</tbody>
</table>
</td>
</tr>
<tr>
<td valign="top" style="padding:0in 0in 0in 0in;background-size:cover">
<div align="center">
<table border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100.0%;background-size:cover">
<tbody>
<tr>
<td valign="top" style="padding:0in 0in 0in 0in;background-size:cover">
<table border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100.0%;background-size:cover">
<tbody>
<tr>
<td width="100%" valign="top" style="width:100.0%;padding:0in 0in 0in 0in">
<table border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100.0%">
<tbody>
<tr>
<td valign="top" style="padding:0in 0in 0in 0in"></td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</div>
            </div>
            `,
        }

        sgMail
            .send(msg)
            .then((response) => {
                console.log(response[0].statusCode)
                console.log(response[0].headers)
            })
            .catch((error) => {
                console.error(error)
            })

        res.status(201).json({ status: true, user })
    }
    catch (e) {
        console.log(e)
        res.status(404).json({ error: e })
    }
}
