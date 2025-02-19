import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';

export function useEmployeeAuth() {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedEmail = Cookies.get('employee_email');
    if (storedEmail) {
      setEmail(storedEmail);
    }
    setLoading(false);
  }, []);

  const loginWithEmail = async (enteredEmail: string) => {
    try {
      const restaurantId = localStorage.getItem('restaurant_id');
      const token = localStorage.getItem('token');

      if (!restaurantId) {
        throw new Error('No restaurant selected');
      }
      if (!token) {
        throw new Error('Authentication token missing');
      }

      Cookies.set('employee_email', enteredEmail, { expires: 7 });

      const { data } = await axios.post(
        'http://localhost:8000/api/verify-employee-email/',
        { email: enteredEmail, restaurant_id: restaurantId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (data.is_valid) {
        setEmail(enteredEmail);
        router.push('/dashboard');
      } else {
        Cookies.remove('employee_email');
        throw new Error('Invalid email, please try again');
      }
    } catch (error) {
      throw new Error('Error verifying email');
    }
  };

  return { email, loginWithEmail, loading };
}
