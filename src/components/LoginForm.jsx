import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = z.object({
  rollNumber: z.string().min(1, 'Roll number is required'),
  name: z.string().min(1, 'Name is required')
});

function LoginForm({ onSubmit, onRegisterClick }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Student Login</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Roll Number</label>
        <input
          type="text"
          {...register('rollNumber')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          disabled={isSubmitting}
        />
        {errors.rollNumber && (
          <p className="mt-1 text-sm text-red-600">{errors.rollNumber.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          {...register('name')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>

      <div className="text-center mt-4">
        <button
          type="button"
          onClick={onRegisterClick}
          className="text-sm text-indigo-600 hover:text-indigo-500"
        >
          Don't have an account? Register
        </button>
      </div>
    </form>
  );
}

export default LoginForm;