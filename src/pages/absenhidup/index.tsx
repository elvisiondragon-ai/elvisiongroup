import React, { useState } from 'react';

const AbsenHidupPage = () => {
  const [contacts, setContacts] = useState([
    { name: '', email: '', phone: '' },
    { name: '', email: '', phone: '' },
    { name: '', email: '', phone: '' },
  ]);

  const handleContactChange = (index, field, value) => {
    const newContacts = [...contacts];
    newContacts[index][field] = value;
    setContacts(newContacts);
  };

  const handleSaveContacts = () => {
    // Here you would call Supabase to save the contacts to the 'absen_hidup' table
    console.log('Saving contacts:', contacts);
    // Example: await supabase.from('absen_hidup').upsert({ user_id: userId, contacts: contacts });
  };
  
  const handleCheckIn = () => {
    // Here you would call Supabase to update the 'last_checked_in' timestamp
    console.log('User checked in.');
    // Example: await supabase.from('absen_hidup').update({ last_checked_in: new Date().toISOString() }).eq('user_id', userId);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4 text-white">
      <div className="w-full max-w-2xl p-8 space-y-8 bg-gray-900 rounded-2xl shadow-2xl shadow-purple-500/20">
        
        {/* Header */}
        <div className="text-center">
            <h1 className="text-5xl font-bold text-purple-500">
            Sileme
            </h1>
            <p className="text-lg text-gray-400 mt-2">
            Your silent guardian. Check in once every 48 hours.
            </p>
        </div>

        {/* Check-in Button */}
        <div className="text-center">
            <button
            onClick={handleCheckIn}
            className="w-full px-6 py-4 text-xl font-bold text-white bg-purple-600 rounded-lg transition-transform transform hover:scale-105 hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50"
            >
            I'm Alive & Well
            </button>
        </div>
        
        <div className="border-t border-gray-700"></div>

        {/* Emergency Contacts Section */}
        <div>
            <h2 className="text-2xl font-semibold text-center text-purple-400 mb-6">Emergency Contacts</h2>
            <div className="space-y-6">
            {contacts.map((contact, index) => (
                <div key={index} className="p-4 bg-gray-800 rounded-lg space-y-3">
                <h3 className="font-semibold text-gray-300">Contact #{index + 1}</h3>
                <input
                    type="text"
                    placeholder="Full Name"
                    value={contact.name}
                    onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                    className="w-full p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                    type="email"
                    placeholder="Email Address"
                    value={contact.email}
                    onChange={(e) => handleContactChange(index, 'email', e.target.value)}
                    className="w-full p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                    type="tel"
                    placeholder="Phone Number"
                    value={contact.phone}
                    onChange={(e) => handleContactChange(index, 'phone', e.target.value)}
                    className="w-full p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                </div>
            ))}
            </div>
        </div>

        {/* Save Button */}
        <div className="text-center">
            <button
                onClick={handleSaveContacts}
                className="w-full px-6 py-3 font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
            >
            Save Contacts
            </button>
            <p className="text-xs text-gray-500 mt-3">
            Alerts will be sent to these contacts if you miss a check-in.
            </p>
        </div>

      </div>
    </div>
  );
};

export default AbsenHidupPage;
