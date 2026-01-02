import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { FiMail, FiPhone, FiMapPin, FiClock } from 'react-icons/fi';
import api from '../../api/axiosConfig';
import { useToast } from '../../components/common/Toast/Toast';
import { SITE_NAME, SITE_URL, CONTACT_INFO } from '../../utils/constants';
import Button from '../../components/common/Button/Button';
import Input, { Textarea } from '../../components/common/Input/Input';

const ContactUs = () => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post('/create-query/', {
        name: form.name,
        email: form.email,
        mobile_number: form.phone,
        message: form.message,
      });
      toast.success('Message sent! We\'ll get back to you soon.');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const contactDetails = [
    { icon: FiMail, label: 'Email', value: CONTACT_INFO.email, href: `mailto:${CONTACT_INFO.email}` },
    { icon: FiPhone, label: 'Phone', value: CONTACT_INFO.phone, href: `tel:${CONTACT_INFO.phone}` },
    { icon: FiMapPin, label: 'Address', value: CONTACT_INFO.address },
    { icon: FiClock, label: 'Hours', value: 'Mon - Sat: 9AM - 9PM' },
  ];

  return (
    <>
      <Helmet>
        <title>Contact Us | {SITE_NAME}</title>
        <meta name="description" content={`Get in touch with ${SITE_NAME}. We're here to help with any questions or concerns.`} />
        <link rel="canonical" href={`${SITE_URL}/contact`} />
      </Helmet>

      <div className="bg-neutral-50 min-h-screen py-12">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl font-bold text-neutral-900 mb-4">
              Get in Touch
            </h1>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-4">
              {contactDetails.map((item) => {
                const Icon = item.icon;
                const content = (
                  <div className="flex items-start gap-4 bg-white p-4 rounded-xl shadow-soft">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">{item.label}</p>
                      <p className="font-medium text-neutral-900">{item.value}</p>
                    </div>
                  </div>
                );

                return item.href ? (
                  <a key={item.label} href={item.href} className="block hover:scale-[1.02] transition-transform">
                    {content}
                  </a>
                ) : (
                  <div key={item.label}>{content}</div>
                );
              })}
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-soft">
                <h2 className="font-semibold text-xl mb-6">Send us a message</h2>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <Input
                    label="Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Input
                  label="Phone"
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="mb-4"
                />

                <Textarea
                  label="Message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  required
                  className="mb-6"
                />

                <Button type="submit" loading={isLoading} size="lg">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
