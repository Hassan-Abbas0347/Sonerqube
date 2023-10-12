const smpp = require('smpp');
const session = smpp.connect('your_smpp_server_ip', your_smpp_server_port);

session.bind_transceiver({
  system_id: 'your_username',
  password: 'your_password'
}, function(pdu) {
  if (pdu.command_status === 0) {
    console.log('Successfully bound to the SMPP server.');
    sendSms();
  } else {
    console.error('Failed to bind to the SMPP server. Status:', pdu.command_status);
    session.close();
  }
});

function sendSms() {
  const message = {
    source_addr: 'SenderPhoneNumber',
    destination_addr: 'RecipientPhoneNumber',
    short_message: 'Hello, SMPP!'
  };

  session.submit_sm(message, function(pdu) {
    if (pdu.command_status === 0) {
      console.log('Message sent successfully. Message ID:', pdu.message_id);
      session.close();
    } else {
      console.error('Failed to send the message. Status:', pdu.command_status);
      session.close();
    }
  });
}

session.on('close', function() {
  console.log('SMPP session closed.');
});

session.on('error', function(err) {
  console.error('SMPP session error:', err);
});
