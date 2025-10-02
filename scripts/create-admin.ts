import { auth } from '../src/lib/auth';

async function createAdmin() {
  try {
    // Use Better Auth's internal API to create the user
    const email = 'michael@costperdemo.com';
    const password = 'e120fleB!';
    const name = 'Admin';

    // Call Better Auth's sign-up internally to ensure proper password hashing
    const result = await fetch('http://localhost:3000/api/auth/sign-up/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        name,
      }),
    });

    if (result.ok) {
      console.log('✅ Admin user created successfully!');
      console.log('Email:', email);
      console.log('Password:', password);
    } else {
      const error = await result.json();
      console.error('❌ Failed to create admin:', error);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createAdmin();

