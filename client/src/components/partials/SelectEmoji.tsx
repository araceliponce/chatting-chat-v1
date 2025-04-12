import { EmojiPicker } from '@ferrucc-io/emoji-picker';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { PopoverClose } from '@radix-ui/react-popover';
import { useState } from 'react';

interface SelectEmojiProps {
  handleEmojiSelect: (data: string) => void
}

export default function SelectEmoji({ handleEmojiSelect }: SelectEmojiProps) {

  const [displayEmoji, setDisplayEmoji] = useState('✨') //this is just for the display
  const handleSelect = (data: any) => {
    handleEmojiSelect(data)
    setDisplayEmoji(data)
  }
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <button className="btn--input" title='Add emoji to your lobby'>

            {displayEmoji}

          </button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="grid emojis-container">
            <EmojiPicker
              // onEmojiSelect={handleEmojiSelect} 
              onEmojiSelect={handleSelect}
              emojisPerRow={5}
            >
              <EmojiPicker.Header>
                <EmojiPicker.Input placeholder="Search emoji" />
              </EmojiPicker.Header>
              <PopoverClose asChild>
                <EmojiPicker.Group>

                  <EmojiPicker.List />

                </EmojiPicker.Group>
              </PopoverClose>
            </EmojiPicker>
          </div>
        </PopoverContent>
      </Popover>
    </>
  )
}
