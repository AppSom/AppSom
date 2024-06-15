import React, { useEffect, useState } from 'react';
import { useTheme } from './themeSet';
import Image from 'next/image';
import convertImgUrl from './convertImgUrl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThLarge, faCalendarAlt, faStar, faEllipsisV, faCog } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Board, BoardJSON } from '../../../interface';
import GetBoards from '@/lib/GetBoards';
import AddBoardPopup from '../Board/AddBoardPopup';
import CreateBoard from '@/lib/CreateBoard';

export default function Sidebar() {
  const { changeTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [boards, setBoards] = useState<Board[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const { data: session } = useSession();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  if (!session) {
    return null;
  }

  useEffect(() => {
    const LoadBoards = async () => {
        const data: BoardJSON = await GetBoards();
        const filteredBoards = data.data.filter(b => (b.owner === session.user.id || b.member.includes(session.user.id)));
        setBoards(filteredBoards);
    };
    LoadBoards();
  }, [boards]);

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    changeTheme({ som: e.target.value });
  };

  const handleDefaultColor = () => {
    changeTheme({ som: '#FF6B18' });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCreateBoard = async (name: string, description: string) => {
    const newBoard: Board = {
        id: crypto.randomUUID(),
        name,
        description,
        lists: [],
        favorite: false,
        owner: session.user.id,
        member: [session.user.id],
        color: ""
    };
    await CreateBoard(newBoard);
};

  const profilePicUrl = 'https://drive.google.com/file/d/17ad4RrjEqQmKiwgwA0PmRLoadt1AiigI/view?usp=drive_link';
  const logoUrl = "https://drive.google.com/file/d/1xNsGNsI9bwcRYSnb5hKCAiHwK0wrkuYD/view?usp=drive_link";

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-som text-white flex flex-col justify-between p-4 font-sans font-bold tracking-wider">
      <div>
        <div className="flex justify-center mt-2 mb-4">
          <Link href="/board">
            <Image
              src={convertImgUrl(logoUrl)}
              alt="Logo"
              width={1000}
              height={1000}
              className="object-contain -my-20"
            />
          </Link>
        </div>
        <hr className="border-white mb-4" />
        <div className="flex justify-center mb-4 relative">
          {session && (
            <>
              <div className="flex items-center p-2 bg-white rounded-lg w-full">
                <div className="relative w-16 h-16">
                  <Image
                    src={session.user.image || profilePicUrl}
                    alt="Profile Picture"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                  />
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-black">{session.user.name}</div>
                </div>
                <button onClick={toggleProfileMenu} className="absolute top-2 right-2">
                  <FontAwesomeIcon icon={faEllipsisV} className="text-black" />
                </button>
              </div>
              {isProfileMenuOpen && (
                <div className="absolute right-0 top-12 mt-2 w-48 bg-white text-black p-4 rounded shadow-lg z-50">
                  <Link href="/auth/edit-profile" className="block text-left mb-2 hover:bg-gray-200">
                    Edit Profile
                  </Link>
                  <button onClick={() => signOut()} className="block text-center mb-2 hover:bg-gray-200">
                    Log Out
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        <ul>
          <li className="mb-2 flex items-center">
            <FontAwesomeIcon icon={faThLarge} className="text-white mr-2 ml-1.5" />
            <a href="/board" className="text-white">Board</a>
          </li>
          <li className="mb-2 flex items-center">
            <FontAwesomeIcon icon={faCalendarAlt} className="text-white mr-2 ml-1.5" />
            <a href="/calendar" className="text-white">Calendar</a>
          </li>
          <li className="mb-2 flex items-center">
            <FontAwesomeIcon icon={faStar} className="text-white mr-2 ml-1.5" />
            <a href="/starred" className="text-white">Starred</a>
          </li>
          <li className="mb-2 mt-5 flex items-center justify-between">
            <a className="text-white font-bold text-xl">Your Board</a>
            <button
            onClick={() => setShowPopup(true)}
            className="text-white font-bold text-xl bg-transparent border-none cursor-pointer focus:outline-none"
          >
            +
          </button>
          </li>
          <div className="max-h-32 overflow-y-auto">
            {
              boards.length > 0 ?
                boards.map((b) =>
                  <li key={b.id} className="mb-2 flex items-center">
                      <FontAwesomeIcon icon={faThLarge} className="text-white mr-2 ml-1.5" />
                      <a href={`/board/${b.id}`} className="text-white">{b.name}</a>
                  </li>
                ) : ""
            }
          </div>

        </ul>
      </div>

      <div>
        <hr className="border-white mb-4" />
        <button
          onClick={toggleMenu}
          className="px-4 py-2 bg-white text-som rounded w-full text-center mb-2 flex items-center justify-center"
        >
          <FontAwesomeIcon icon={faCog} className="text-som mr-2" />
          Theme Setting
        </button>
        {isMenuOpen && (
          <div className="bg-white text-som p-2 rounded shadow-lg">
            <label htmlFor="colorPicker" className="block text-center text-som mb-2">
              Pick a color
            </label>
            <input
              type="color"
              id="colorPicker"
              name="colorPicker"
              onChange={handleColorChange}
              className="w-full mb-4"
            />
            <button
              onClick={handleDefaultColor}
              className="px-4 py-1 bg-som text-white rounded w-full text-center"
            >
              Default Color
            </button>
          </div>
        )}
      </div>
      {showPopup && (
                <AddBoardPopup 
                    onClose={() => setShowPopup(false)}
                    onSave={handleCreateBoard}
                />
            )}
    </div>
  );
}
