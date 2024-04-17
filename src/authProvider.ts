import { GoogleAuthProvider } from 'firebase/auth';
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  login_hint: 'user@example.com',
});
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

export default provider;
