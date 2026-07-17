hey add on this website backend and database .
for backend and database use supabase database 
from home page from this page here dont have to change anythings just check all buttons and their links if links are not ok then add the link properly . all redirectlinks like libray pages . and just change the plan prising like pro is 6$ and proffessional is 10$ and this for lifetime access . 

signin page -
on this page if the admin login then redirect to admin page like /admin/user
or user login then redirect to /template(convert it into /lib) page and here show the frist sub button things like Components buttons frist sub  button preview. 

signup- here user can signup as user store his data like gmail and full name passwoard . after signup he auto redirect to /profile page .
profile page - here user see  their data and many things what are show all like full name gmail etc . example - on Alex Chen here user see his name , on Status - here user see active or not , Joined - exatc join data ,Verified- email verified or not ,// ACCOUNT SETTINGS- here he can edit his data like name and  Email
// SUBSCRIPTION- here user see his current account type in frist time he see here FREE and when click on UPGRADE PLAN button then it redirect to /payment page .

payment page - here if user comes from landing page prising then it auto selected the plan or if uere comes from /profile and he is a free plan then he have to select the plan and then it show the payment method the Cryptocurrency Transfer then he have to select the coin name and the block chain name under their user see exact see same things no change and then he see the address and this addres comes from .env (on the .env here create all demo addres with their name in future i will change it ) and when click on payment done then he have to input the trx id then confirm payment then he see this massage - Admin check the payment and update you as Pro/professional User . but one things is every time to buy a plan user have to must be logged in if user not loggedin then send him to signin page . . and after sign in then send him auto pricing page . 

and now the important things like /pro and /template - add this two page and make sure remove all the buttons and sub buttons from sidebar . all of things comes or set from database and also their data like preview link, direct zip download link  , all the codes etc and also check the /admin/assets page because all the data add from this page . all the things like icons and names and subbuttons , files links etc all . and every libry give uniq link like domain/lib/components/button-02 .

now the admin/users - here remove all hard coded data and user list here show all real user list and also user can update the users profile like pro, professionals and free and also   can suspend and active etc . and many things .

now the admin/payments - here show all the payments and details and if admin approve the payments then just auto update his profile as he buy the plan .

and use full profe sequrity on login , signin signup and like ssl and login rate limit , and also many things . and also make sure the proffessional users can access all the codes , the pro users acces only free and pro codes , the free users can access only free codes , but every on can see preview . and make sure users can see the preview only without login , but acces the code user must be logged in .

and also male sure the /pro and /lib page convert into /lib 
and also make sure don't change any design single bit 