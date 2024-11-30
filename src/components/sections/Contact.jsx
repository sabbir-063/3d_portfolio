import React from "react";
import styled from "styled-components";

// Styled-components for the form
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-contnet: center;
  position: rlative;
  z-index: 1;
  align-items: center;
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  width: 100%;
  max-width: 1100px;
  gap: 12px;
  @media (max-width: 960px) {
    flex-direction: column;
  }
`;
const Title = styled.div`
  font-size: 52px;
  text-align: center;
  font-weight: 600;
  margin-top: 20px;
  color: ${({ theme }) => theme.text_primary};
  @media (max-width: 768px) {
    margin-top: 12px;
    font-size: 32px;
  }
`;
const Desc = styled.div`
  font-size: 18px;
  text-align: center;
  font-weight: 600;
  color: ${({ theme }) => theme.text_secondary};
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;
const FormContainer = styled.div`
  background: #ffffff;
  padding: 30px 40px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px; /* Increased width */
  text-align: center;
  margin: 50px auto;
  font-family: Arial, sans-serif;

  @media (max-width: 768px) {
    padding: 20px;
    max-width: 90%; /* Responsive for smaller screens */
  }
`;

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormHeading = styled.h2`
  margin-bottom: 20px;
  color: #333333;
  font-size: 1.8em;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 14px 15px;
  margin: 10px 0;
  border: 1px solid #dddddd;
  border-radius: 5px;
  font-size: 16px;
  box-sizing: border-box;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 14px 15px;
  margin: 10px 0;
  border: 1px solid #dddddd;
  border-radius: 5px;
  font-size: 16px;
  box-sizing: border-box;
  height: 250px; /* Increased height */
  resize: none;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const FormButton = styled.button`
  background: #007bff;
  color: #ffffff;
  border: none;
  padding: 14px 20px;
  font-size: 18px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background: #0056b3;
  }
`;

const FormResult = styled.span`
  margin-top: 15px;
  font-size: 16px;
  color: #555555;
`;

function App() {
  const [result, setResult] = React.useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);

    formData.append("access_key", "5b3db061-84a8-4626-a55d-8d82521c43c9");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      setResult("Form Submitted Successfully");
      event.target.reset();
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
  };

  return (
    <Container id="contact">
      <Wrapper>
        <Title>Contact</Title>
        <Desc
          style={{
            marginBottom: "40px",
          }}
        >
          Feel free to reach out to me for any questions or opportunities!
        </Desc>
        <FormContainer>
          <ContactForm onSubmit={onSubmit}>
            <FormHeading>Email Me 🚀</FormHeading>
            <FormInput type="text" name="name" placeholder="Your Name" required />
            <FormInput type="email" name="email" placeholder="Your Email" required />
            <FormTextarea
              name="message"
              placeholder="Your Message"
              rows="10" /* Additional rows for textarea */
              required
            ></FormTextarea>
            <FormButton type="submit">Submit</FormButton>
          </ContactForm>
          <FormResult>{result}</FormResult>
        </FormContainer>
      </Wrapper>
    </Container>
  );
}

export default App;
