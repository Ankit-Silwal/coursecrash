export const checkpassword=(password)=>{
  const errors=[];
  if(password.length<8){
    errors.push("The length of the password should be greater than 8")
  }
  if(!/[A-Z]/.test(password)){
    errors.push("The password must contain at least one uppercase letter")
  }
  if(!/[a-z]/.test(password)){
    errors.push("The password must contain at least one lowercase letter")
  }
  if(!/[0-9]/.test(password)){
    errors.push("The password must contain at least one numerical value");
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
  {
    errors.push("Password must contain at least one special character");
  }
  if (/\s/.test(password))
  {
    errors.push("Password must not contain spaces");
  }
  return{
    isStrong:errors.length===0,
    errors
  }
}
