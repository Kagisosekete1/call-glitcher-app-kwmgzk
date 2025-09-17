
import React, { useState } from 'react';
import Icon from '../../components/Icon';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SimpleBottomSheet from '../../components/BottomSheet';
import { commonStyles, colors, buttonStyles } from '../../styles/commonStyles';

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
  
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');

  const toggleAutoJam = (contactId: string) => {
    console.log('Toggling auto jam for contact:', contactId);
    setContacts(prevContacts =>
      prevContacts.map(contact =>
        contact.id === contactId
          ? { ...contact, autoJam: !contact.autoJam }
          : contact
      )
    );
  };

  const addContact = () => {
    if (!newContactName.trim() || !newContactPhone.trim()) {
      Alert.alert('Error', 'Please fill in both name and phone number');
      return;
    }

    console.log('Adding new contact:', newContactName, newContactPhone);
    const newContact: Contact = {
      id: Date.now().toString(),
      name: newContactName.trim(),
      phone: newContactPhone.trim(),
      autoJam: false,
    };

    setContacts(prevContacts => [...prevContacts, newContact]);
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
            setContacts(prevContacts =>
              prevContacts.filter(contact => contact.id !== contactId)
            );
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        {/* Header */}
        <View style={commonStyles.section}>
          <Text style={commonStyles.title}>Contacts</Text>
          <Text style={commonStyles.textSecondary}>
            Manage auto-jam settings for specific contacts
          </Text>
        </View>

        {/* Add Contact Button */}
        <View style={commonStyles.buttonContainer}>
          <TouchableOpacity
            style={[buttonStyles.primary, { marginBottom: 20 }]}
            onPress={() => setShowAddContact(true)}
          >
            <Text style={[commonStyles.text, { color: colors.background }]}>
              Add Contact
            </Text>
          </TouchableOpacity>
        </View>

        {/* Contacts List */}
        {contacts.map(contact => (
          <View key={contact.id} style={commonStyles.card}>
            <View style={commonStyles.row}>
              <View style={{ flex: 1 }}>
                <Text style={commonStyles.subtitle}>{contact.name}</Text>
                <Text style={commonStyles.textSecondary}>{contact.phone}</Text>
              </View>
              
              <View style={commonStyles.centerRow}>
                <TouchableOpacity
                  onPress={() => toggleAutoJam(contact.id)}
                  style={{
                    backgroundColor: contact.autoJam ? colors.success : colors.grey,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 16,
                    marginRight: 10,
                  }}
                >
                  <Text style={[
                    commonStyles.textSecondary,
                    { 
                      color: contact.autoJam ? colors.background : colors.text,
                      fontSize: 12 
                    }
                  ]}>
                    {contact.autoJam ? 'Auto-Jam ON' : 'Auto-Jam OFF'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => removeContact(contact.id)}
                  style={{ padding: 8 }}
                >
                  <Icon name="trash-outline" size={20} color={colors.danger} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        {contacts.length === 0 && (
          <View style={[commonStyles.card, { alignItems: 'center', padding: 40 }]}>
            <Icon name="people-outline" size={60} color={colors.textSecondary} />
            <Text style={[commonStyles.text, { marginTop: 16 }]}>
              No contacts added yet
            </Text>
            <Text style={commonStyles.textSecondary}>
              Add contacts to enable auto-jamming
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Add Contact Bottom Sheet */}
      <SimpleBottomSheet
        isVisible={showAddContact}
        onClose={() => setShowAddContact(false)}
      >
        <View style={{ padding: 20 }}>
          <Text style={commonStyles.subtitle}>Add New Contact</Text>
          
          <View style={{ marginTop: 20 }}>
            <Text style={[commonStyles.text, { marginBottom: 8 }]}>Name</Text>
            <TextInput
              style={{
                backgroundColor: colors.backgroundAlt,
                borderColor: colors.grey,
                borderWidth: 1,
                borderRadius: 8,
                padding: 12,
                color: colors.text,
                marginBottom: 16,
              }}
              value={newContactName}
              onChangeText={setNewContactName}
              placeholder="Enter contact name"
              placeholderTextColor={colors.textSecondary}
            />

            <Text style={[commonStyles.text, { marginBottom: 8 }]}>Phone Number</Text>
            <TextInput
              style={{
                backgroundColor: colors.backgroundAlt,
                borderColor: colors.grey,
                borderWidth: 1,
                borderRadius: 8,
                padding: 12,
                color: colors.text,
                marginBottom: 20,
              }}
              value={newContactPhone}
              onChangeText={setNewContactPhone}
              placeholder="Enter phone number"
              placeholderTextColor={colors.textSecondary}
              keyboardType="phone-pad"
            />

            <TouchableOpacity
              style={buttonStyles.primary}
              onPress={addContact}
            >
              <Text style={[commonStyles.text, { color: colors.background }]}>
                Add Contact
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SimpleBottomSheet>
    </SafeAreaView>
  );
}
