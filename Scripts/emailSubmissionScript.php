<?php
if (isset($_POST['emailSendButton'])) {
  $email = $_POST['email'];
  $message = $_POST['message'];

  mail('maier.jonathanelias@gmail.com',"Send by: " + $email, $message)
}

if (isset($_POST['subscribeButton'])) {
  $subScriptionEmail = $_POST['subscriptionEmail'];

  mail('maier.jonathanelias@gmail.com',"New Subscriber: " + $subScriptionEmail, "A User with the Email-address: " + $subScriptionEmail + " wants to be informed about upcoming News!")
}
?>

