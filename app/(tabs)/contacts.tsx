
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles, colors, buttonStyles } from '../../styles/commonStyles';
import Icon from '../../components/Icon';
import SimpleBottomSheet from '../../components/BottomSheet';

interface Contact {
  id: string;
  name: string;
  phone: string;
  autoJam: boolean;
}

export default function ContactsScreen() {
  const [contacts, setContacts] = useState<Contact[]>([
    { id: '1', name: 'John Doe', phone: '+1 (555) 123-4567', autoJam: true },
    { id: '2', name: 'Jane Smith', phone: '+1 (555) 987-6543', autoJam: false },
    { id: '3', name: 'Bob Johnson', phone: '+1 (555) 456-7890', autoJam: true },
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery)
  );

  const toggleAutoJam = (contactId: string) => {
    console.log('Toggling auto jam for contact:', contactId);
    setContacts(prev =>
      prev.map(contact =>
        contact.id === contactId
          ? { ...contact, autoJam: !contact.autoJam }
          : contact
      )
    );
  };

  const addContact = () => {
    if (!newContactName.trim() || !newContactPhone.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const newContact: Contact = {
      id: Date.now().toString(),
      name: newContactName.trim(),
      phone: newContactPhone.trim(),
      autoJam: false,
    };

    console.log('Adding new contact:', newContact);
    setContacts(prev => [...prev, newContact]);
    setNewContactName('');
    setNewContactPhone('');
    setShowAddContact(false);
  };

  const removeContact = (contactId: string) => {
    console.log('Removing contact:', contactId);
    Alert.alert(
      'Remove Contact',
      'Are you sure you want to remove this contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setContacts(prev => prev.filter(contact => contact.id !== contactId));
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        {/* Header */}
        <View style={[commonStyles.section, { marginTop: 20, marginBottom: 10 }]}>
          <Text style={commonStyles.title}>Auto-Jam Contacts</Text>
          <Text style={commonStyles.textSecondary}>
            Select contacts to automatically jam when they call
          </Text>
        </View>

        {/* Search Bar */}
        <View style={[commonStyles.card, { marginBottom: 10 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="search" size={20} color={colors.textSecondary} />
            <TextInput
              style={{
                flex: 1,
                marginLeft: 10,
                color: colors.text,
                fontSize: 16,
                paddingVertical: 8,
              }}
              placeholder="Search contacts..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Add Contact Button */}
        <TouchableOpacity
          style={[buttonStyles.primary, { marginBottom: 20 }]}
          onPress={() => setShowAddContact(true)}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="add" size={20} color={colors.background} />
            <Text style={{
              color: colors.background,
              fontSize: 16,
              fontWeight: '600',
              marginLeft: 8,
            }}>
              Add Manual Number
            </Text>
          </View>
        </TouchableOpacity>

        {/* Contacts List */}
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {filteredContacts.map((contact) => (
            <View key={contact.id} style={commonStyles.card}>
              <View style={commonStyles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={[commonStyles.text, { textAlign: 'left', marginBottom: 4 }]}>
                    {contact.name}
                  </Text>
                  <Text style={[commonStyles.textSecondary, { textAlign: 'left' }]}>
                    {contact.phone}
                  </Text>
                </View>
                
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <TouchableOpacity
                    style={{
                      width: 50,
                      height: 30,
                      borderRadius: 15,
                      backgroundColor: contact.autoJam ? colors.primary : colors.grey,
                      justifyContent: 'center',
                      alignItems: contact.autoJam ? 'flex-end' : 'flex-start',
                      paddingHorizontal: 3,
                    }}
                    onPress={() => toggleAutoJam(contact.id)}
                  >
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: colors.text,
                      }}
                    />
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={() => removeContact(contact.id)}
                  >
                    <Icon name="trash" size={20} color={colors.danger} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
          
          {filteredContacts.length === 0 && (
            <View style={[commonStyles.card, { alignItems: 'center', padding: 40 }]}>
              <Icon name="people-outline" size={40} color={colors.textSecondary} />
              <Text style={[commonStyles.textSecondary, { marginTop: 10 }]}>
                {searchQuery ? 'No contacts found' : 'No contacts added yet'}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Add Contact Bottom Sheet */}
      <SimpleBottomSheet
        isVisible={showAddContact}
        onClose={() => setShowAddContact(false)}
      >
        <View style={{ padding: 20 }}>
          <Text style={[commonStyles.subtitle, { marginBottom: 20 }]}>
            Add Manual Number
          </Text>
          
          <View style={[commonStyles.card, { marginBottom: 15 }]}>
            <TextInput
              style={{
                color: colors.text,
                fontSize: 16,
                paddingVertical: 8,
              }}
              placeholder="Contact Name"
              placeholderTextColor={colors.textSecondary}
              value={newContactName}
              onChangeText={setNewContactName}
            />
          </View>
          
          <View style={[commonStyles.card, { marginBottom: 20 }]}>
            <TextInput
              style={{
                color: colors.text,
                fontSize: 16,
                paddingVertical: 8,
              }}
              placeholder="Phone Number"
              placeholderTextColor={colors.textSecondary}
              value={newContactPhone}
              onChangeText={setNewContactPhone}
              keyboardType="phone-pad"
            />
          </View>
          
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity
              style={[buttonStyles.secondary, { flex: 1 }]}
              onPress={() => setShowAddContact(false)}
            >
              <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600' }}>
                Cancel
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[buttonStyles.primary, { flex: 1 }]}
              onPress={addContact}
            >
              <Text style={{ color: colors.background, fontSize: 16, fontWeight: '600' }}>
                Add Contact
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SimpleBottomSheet>
    </SafeAreaView>
  );
}
