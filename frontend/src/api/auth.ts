export const handleSignup = async (formData: {
  username: string;
  email: string;
  password: string;
}) => {
  try {
    const res = await fetch('http://localhost:5000/api/v1/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      return { success: true, message: data.message };
    } else {
      const errorMessage =
        data.message || data.errors || 'Signup failed. Check your input.';
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    return { success: false, message: 'Server error' };
  }
};
