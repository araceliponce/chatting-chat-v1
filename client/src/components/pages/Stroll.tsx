import React, { useRef } from 'react';
import { useGesture } from '@use-gesture/react';
import { Lobby } from '@/utils/types';
import { Link } from 'react-router-dom';
import { getTimestampFromSeconds } from '@/utils/functions';
import FormCreateLobby from '../partials/FormCreateLobby';



interface StrollProps {
  items: Lobby[]
}

export const Stroll: React.FC<StrollProps> = ({ items }) => {


  const listRef = useRef<HTMLUListElement | null>(null);



  const bind = useGesture({

    onWheel: ({ delta: [, dy] }) => {

      //logica normal para scroll en horizontal:
      if (!listRef.current) return;
      listRef.current.scrollLeft += dy; // Usa deltaY, no deltaX, para scrollear horizontalmente

    },
  });

  // console.log('items', items)


  return (
    <section
    // className='layout'
    >

      <ul
        ref={listRef}
        {...bind()}
        style={{
          overflowX: 'auto',
          scrollBehavior: 'smooth',
          direction: 'ltr',
          overscrollBehaviorX: 'contain',
          paddingInline: '1rem'
        }}
        className='layout__content scrollable'
      >
        {items.map((item) => {

          const userCount = item.users?.length || 1; // default 1
          const minHeight = Math.min(123 * userCount, 360);// elige entre usar 400px de altura ó userCount x n

          // const imAuthor = msg.username === user.username ? styles.mine : styles.notmine

          return (

            <li
              key={item.id}
            >
              <Link
                style={{
                  minHeight
                }}

                className={`layout__content__link ${item.mine ? 'mine' : ''}`}
                to={{ pathname: `/lobby/${item.id}` }}
              >



                <div className="emoji" aria-hidden>{item.emoji}</div>
                <div className='text-sm'>
                  <strong className='title'>{item.name}</strong>

                  <p className='pt-4'>Created: {getTimestampFromSeconds(item.createdAt).longDayTimestamp}</p>

                  {item.users && (
                    <div className="flex items-center gap-1">
                      <span className="avatars -space-x-2">
                        {item.users.map((_, index) => (
                          <span className='block size-4 rounded-full' key={index}></span>
                        ))}
                      </span>
                      <small className='text-[1em] opacity-70'>{item.users.length} user{item.users.length > 1 ? 's' : ''}</small>
                    </div>
                  )}
                </div>



              </Link>
            </li>
          )
        })}

      </ul>


      <div
        className="layout__footer"
      >
        <FormCreateLobby />
      </div>

    </section >
  );
};
