import { useMutation } from '@apollo/client';
import React, { useState } from 'react';

import { CREATE_LOBBY } from '@/graphql_utils/mutations';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import SelectEmoji from './SelectEmoji'; // https://github.com/ferrucc-io/emoji-picker

export default function FormCreateLobby() {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState<string | null>(null);
  const navigate = useNavigate();

  const [createLobby] = useMutation(CREATE_LOBBY, {
    onCompleted: (data) => {
      toast.message('Lobby created!');
      if (data?.createLobby?.id) {
        navigate(`/lobby/${data.createLobby.id}`);
      }
    },
    //on error to show toast
    onError: (err) => {
      const message = err.message;
      if (message.includes('duplicate key')) {
        if (message.includes('email')) {
          toast.error('This email is already registered.');
        } else if (message.includes('duplicate')) {
          toast.error('This display name is already taken.');
        } else {
          toast.error('This is weird. Something happened');
        }
      } else {
        toast.error('Something went wrong. Try again.');
      }
      console.error('ApolloError:', err);
    }
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter a name for your lobby.');
      return
    };

    try {
      await createLobby({
        variables: {
          name: name.trim(),
          emoji: emoji ?? null,
        }
      });
    } catch (err) {
      console.error('Failed to create lobby', err);
    }

    setName('');

  };

  const handleEmojiSelect = (data: string) => {
    setEmoji(data)
  }
  return (

    <section className='section-container py-4 px-4'>

      <p className='pb-2 pl-2 text-xs opacity-80'>Create a new lobby</p>




      <form onSubmit={handleSubmit} className='input-btn-container'>

        <div className="flex">
          <SelectEmoji handleEmojiSelect={handleEmojiSelect} />
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder='Name it'
          />
        </div>



        <div className="btn-wrapper flex flex-wrap gap-1">
          {/* <SelectEmoji handleEmojiSelect={handleEmojiSelect} /> */}
          <button
            type="submit"
            className='btn--main'
          >
            Submit
          </button>
        </div>

      </form>

    </section>
  );
}
