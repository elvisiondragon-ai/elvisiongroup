// Debug email splitting logic
const testEmails = [
  'rasa.tastas@gmail.com',
  'tastas@gmail.com', 
  'tastas.rasa@gmail.com',
  'rasa123@gmail.com',
  'user.name@domain.com'
];

console.log('Email split results:');
testEmails.forEach(email => {
  const splitResult = email.split('@')[0];
  console.log(`${email} -> ${splitResult}`);
});

// Common email patterns that could cause name issues
console.log('\nPotential name confusion patterns:');
console.log('firstname.lastname@domain.com -> firstname (loses lastname)');
console.log('lastname.firstname@domain.com -> lastname (loses firstname)');
console.log('nickname.realname@domain.com -> nickname (loses real name)');