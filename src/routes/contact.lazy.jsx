import { createLazyFileRoute } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import postContact from '../api/postContact'

function ContactInput({ type, name, placeholder }) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
    />
  )
}

export const Route = createLazyFileRoute('/contact')({
  component: ContactRoute,
})

function ContactRoute() {
  const mutation = useMutation({
    mutationFn: function (formData) {
       return postContact( 
        formData.get('name'),
        formData.get('email'),
        formData.get('message')
      );
    }
  })
  return (
    <div className="contact">
      <h2>Contact Us</h2>
      {mutation.isSuccess ? (
        <h3>Message sent!</h3>
      ) : (
        <form action={mutation.mutate}>
          <ContactInput type="text" name="name" placeholder="Name" />
          <ContactInput type="email" name="email" placeholder="Email" />
          <textarea name="message" placeholder="Message" />
          <button type="submit">Send</button>
        </form>
      )}
    </div>
  );
}