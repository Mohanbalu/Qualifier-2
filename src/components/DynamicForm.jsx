import { useState } from 'react';
import { useForm } from 'react-hook-form';

function DynamicForm({ formData, onSubmitComplete }) {
  const [currentSection, setCurrentSection] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors }, trigger } = useForm();
  const sections = formData?.sections || [];

  const onSubmit = async (data) => {
    console.log('Form submitted:', data);
    setIsSubmitted(true);
    setTimeout(() => {
      onSubmitComplete();
    }, 2000);
  };

  const validateSection = async () => {
    const currentFields = sections[currentSection].fields.map(field => field.fieldId);
    const isValid = await trigger(currentFields);
    return isValid;
  };

  const handleNext = async () => {
    const isValid = await validateSection();
    if (isValid && currentSection < sections.length - 1) {
      setCurrentSection(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    }
  };

  const renderField = (field) => {
    const commonProps = {
      ...register(field.fieldId, {
        required: field.required ? 'This field is required' : false,
        minLength: field.minLength ? {
          value: field.minLength,
          message: `Minimum length is ${field.minLength}`
        } : undefined,
        maxLength: field.maxLength ? {
          value: field.maxLength,
          message: `Maximum length is ${field.maxLength}`
        } : undefined
      }),
      placeholder: field.placeholder,
      'data-testid': field.dataTestId,
      className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
    };

    switch (field.type) {
      case 'text':
      case 'tel':
      case 'email':
      case 'date':
        return <input type={field.type} {...commonProps} />;
      
      case 'textarea':
        return <textarea {...commonProps} />;
      
      case 'dropdown':
        return (
          <select {...commonProps}>
            <option value="">Select an option</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value} data-testid={option.dataTestId}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map(option => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  value={option.value}
                  {...register(field.fieldId, { required: field.required })}
                  data-testid={option.dataTestId}
                  className="mr-2"
                />
                <label>{option.label}</label>
              </div>
            ))}
          </div>
        );
      
      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map(option => (
              <div key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  value={option.value}
                  {...register(field.fieldId)}
                  data-testid={option.dataTestId}
                  className="mr-2"
                />
                <label>{option.label}</label>
              </div>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  if (!formData) {
    return <div>Loading form...</div>;
  }

  if (isSubmitted) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Form Submitted Successfully!</h2>
        <p className="text-gray-600">Redirecting to login...</p>
      </div>
    );
  }

  const currentSectionData = sections[currentSection];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-2xl font-bold">{formData.formTitle}</h2>
      
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">{currentSectionData.title}</h3>
        <p className="text-gray-600 mb-4">{currentSectionData.description}</p>
        
        {currentSectionData.fields.map(field => (
          <div key={field.fieldId} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            {renderField(field)}
            {errors[field.fieldId] && (
              <p className="mt-1 text-sm text-red-600">{errors[field.fieldId].message}</p>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        {currentSection > 0 && (
          <button
            type="button"
            onClick={handlePrev}
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700"
          >
            Previous
          </button>
        )}
        
        {currentSection < sections.length - 1 ? (
          <button
            type="button"
            onClick={handleNext}
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            Submit
          </button>
        )}
      </div>
    </form>
  );
}

export default DynamicForm;