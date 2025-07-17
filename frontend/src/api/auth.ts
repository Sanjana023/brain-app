import { signupSchema } from '../../../backend/src/validations/authValidation';

export const handleSignup = async (formData: {
  username: string;
  email: string;
  password: string;
}) => {
  const result = signupSchema.safeParse(formData);

  if (!result.success) {
    return { success: false, message: result.error };  
  }

  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message || 'Signup failed' };
    }

    return { success: true, message: data.message };
  } catch (err) {
    return { success: false, message: 'Network error' };
  }
};
