import toast from 'react-hot-toast';

export const handleSignup = async (formData: {
  username: string;
  email: string;
  password: string;
}) => {
  const { username, email, password } = formData;

  // Manual validation
  if (
    !username ||
    username.length < 3 ||
    username.length > 10 ||
    !/^[a-zA-Z\s]+$/.test(username)
  ) {
    toast.error(
      'Username must be 3–10 letters and contain only alphabets and spaces'
    );
    return { success: false, message: 'Invalid username' };
  }

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    toast.error('Enter a valid email address');
    return { success: false, message: 'Invalid email' };
  }

  if (!password || password.length < 6) {
    toast.error('Password must be at least 6 characters');
    return { success: false, message: 'Invalid password' };
  }

  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();

    if (res.status === 409) {
      toast.error('User already exists with this email');
      return { success: false, message: 'User already exists' };
    }

    if (!res.ok) {
      toast.error(data.message || 'Signup failed');
      return { success: false, message: data.message || 'Signup failed' };
    }

    toast.success('Signup successful');
    return { success: true, message: data.message };
  } catch (err) {
    toast.error('Network error');
    return { success: false, message: 'Network error' };
  }
};
