import React, { useState } from 'react';

const MOCK_CONTACTS = [
  { name: 'Alice', ownerAddress: '0x1234567890abcdef1234567890abcdef12345678', email: 'alice@email.com' },
  { name: 'Bob', ownerAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd', email: 'bob@email.com' },
  { name: 'Charlie', ownerAddress: '0x9876543210fedcba9876543210fedcba98765432', email: 'charlie@email.com' },
];

const MOCK_MESSAGES: Record<string, { from: string; text: string }[]> = {
  'alice@email.com': [
    { from: 'Alice', text: 'Hi! How can I help you?' },
    { from: 'You', text: 'Hello Alice, I have a question about my tokens.' },
    { from: 'Alice', text: 'Sure! Ask me anything.' },
  ],
  'bob@email.com': [
    { from: 'Bob', text: 'Hey! Ready for the next auction?' },
    { from: 'You', text: 'Hi Bob, yes! Can you send me the details?' },
    { from: 'Bob', text: 'Of course, check your email.' },
  ],
  'charlie@email.com': [
    { from: 'Charlie', text: 'Hello! Need help with your wallet?' },
    { from: 'You', text: 'Hi Charlie, I can\'t see my collectibles.' },
    { from: 'Charlie', text: 'Try refreshing the page or reconnecting your wallet.' },
  ],
};

const Contact: React.FC = () => {
  const [search, setSearch] = useState('');
  const [contacts, setContacts] = useState(MOCK_CONTACTS);
  const [selected, setSelected] = useState(MOCK_CONTACTS[0]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(
    MOCK_MESSAGES[MOCK_CONTACTS[0].email] || []
  );
  const [customMessages, setCustomMessages] = useState<Record<string, { from: string; text: string }[]>>({});

  // Sprawdź czy wpisany adres jest już kontaktem
  const filtered = search
    ? contacts.filter(c =>
        c.ownerAddress.toLowerCase().includes(search.toLowerCase()) ||
        c.name.toLowerCase().includes(search.toLowerCase())
      )
    : contacts;

  // Jeśli wpisany adres nie istnieje w kontaktach, dodaj tymczasowy kontakt
  let showCustomContact = false;
  let customContact = null;
  if (
    search &&
    !filtered.length &&
    /^0x[a-fA-F0-9]{40}$/.test(search.trim())
  ) {
    showCustomContact = true;
    customContact = {
      name: 'Dawid',
      ownerAddress: search.trim(),
      email: 'dawid12345@email.com',
    };
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const key = selected.email || selected.ownerAddress;
    if (MOCK_MESSAGES[key]) {
      setMessages([...messages, { from: 'You', text: message }]);
    } else {
      setCustomMessages(prev => ({
        ...prev,
        [key]: [...(customMessages[key] || []), { from: 'You', text: message }],
      }));
      setMessages([...(customMessages[key] || []), { from: 'You', text: message }]);
    }
    setMessage('');
  };

  const handleSelect = (contact: typeof contacts[0]) => {
    setSelected(contact);
    const key = contact.email || contact.ownerAddress;
    if (MOCK_MESSAGES[key]) {
      setMessages(MOCK_MESSAGES[key]);
    } else {
      setMessages(customMessages[key] || []);
    }
  };

  const handleCopy = async (address: string) => {
    await navigator.clipboard.writeText(address);
  };

  const handleAddCustomContact = () => {
    if (
      customContact &&
      !contacts.some(c => c.ownerAddress === customContact!.ownerAddress)
    ) {
      setContacts([...contacts, customContact]);
      setSelected(customContact);
      setMessages(customMessages[customContact.ownerAddress] || []);
      setSearch('');
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-gray-900 rounded-lg shadow-lg mt-8 max-w-4xl mx-auto min-h-[500px]">
      {/* Kontakty */}
      <div className="md:w-1/3 w-full bg-gray-800 p-4 rounded-l-lg">
        <h2 className="text-xl font-bold text-white mb-4">Contacts</h2>
        <input
          type="text"
          placeholder="Search by name or address..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full mb-4 px-3 py-2 rounded bg-gray-700 text-white"
        />
        <ul>
          {filtered.map((contact, idx) => (
            <li
              key={contact.ownerAddress}
              onClick={() => handleSelect(contact)}
              className={`mb-2 p-3 rounded cursor-pointer transition flex flex-col gap-1 ${
                selected.ownerAddress === contact.ownerAddress
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">{contact.name}</span>
                {contact.email && (
                  <span className="text-xs bg-gray-900 px-2 py-1 rounded">{contact.email}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs break-all">{contact.ownerAddress}</span>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    handleCopy(contact.ownerAddress);
                  }}
                  className="ml-1 px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded text-xs text-white"
                  title="Copy address"
                >
                  Copy
                </button>
              </div>
            </li>
          ))}
          {showCustomContact && customContact && (
            <li
              className={`mb-2 p-3 rounded cursor-pointer transition flex flex-col gap-1 bg-green-700 text-white`}
              onClick={handleAddCustomContact}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">{customContact.name}</span>
                <span className="text-xs bg-gray-900 px-2 py-1 rounded">{customContact.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs break-all">{customContact.ownerAddress}</span>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    handleCopy(customContact.ownerAddress);
                  }}
                  className="ml-1 px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded text-xs text-white"
                  title="Copy address"
                >
                  Copy
                </button>
              </div>
              <span className="text-xs mt-1">Click to add and start chat</span>
            </li>
          )}
          {!filtered.length && !showCustomContact && (
            <li className="text-gray-400">No contacts found.</li>
          )}
        </ul>
      </div>

      {/* Chat */}
      <div className="md:w-2/3 w-full bg-gray-950 p-6 flex flex-col rounded-r-lg">
        <div className="mb-4">
          <div className="text-lg font-bold text-white">
            Chat with {selected.name}
          </div>
          <div className="text-xs text-gray-400 break-all">{selected.ownerAddress}</div>
          {selected.email && (
            <div className="text-xs text-gray-400">{selected.email}</div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto mb-4 bg-gray-900 rounded p-3">
          {messages.length === 0 && (
            <div className="text-gray-500 text-center">No messages yet.</div>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-2 ${
                msg.from === 'You'
                  ? 'text-right'
                  : 'text-left'
              }`}
            >
              <span
                className={`inline-block px-3 py-2 rounded-lg ${
                  msg.from === 'You'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-200'
                }`}
              >
                <span className="font-semibold">{msg.from}:</span> {msg.text}
              </span>
            </div>
          ))}
        </div>
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            className="flex-1 px-3 py-2 rounded bg-gray-800 text-white"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;