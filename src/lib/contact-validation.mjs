export function validate(input, products) {
 const errors = {}, clean = {};
 for (const [field,max] of Object.entries({ name:120,email:254,message:5000 })) {
  const value = input[field]; clean[field] = typeof value === 'string' ? value.trim() : '';
  if (!clean[field] || [...clean[field]].length>max) errors[field] = `Enter a ${field} of 1–${max} characters.`;
 }
 if (/[\x00-\x1f\x7f]/.test(clean.name)) errors.name='Please enter your name on one line.';
 if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(clean.email) || /[\r\n]/.test(clean.email)) errors.email='Please enter a valid email address.';
 if (clean.message.includes('\0')) errors.message='Please remove unsupported characters.';
 const product = products.find(p => p.id === input.product);
 if (typeof input.product !== 'string' || (input.product && !product)) errors.product='Please select a product from the catalogue.';
 clean.product = product?.title || '';
 return { errors, clean };
}
