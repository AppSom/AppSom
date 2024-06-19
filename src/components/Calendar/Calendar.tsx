'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';
import { Board, BoardJSON, Card } from '../../../interface';
import GetBoards from '@/lib/GetBoards';
import ViewCardPopup from '@/components/Board/ViewCardPopup';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; 

const getWeekDates = (startDate: Date) => {
  const start = new Date(startDate);
  start.setDate(start.getDate() - start.getDay()); // Set to the start of the week (Sunday)
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    return date;
  });
  return dates;
};

const filterCardsByUserAndBoard = (boards: Board[], userId: string) => {
  let filteredCards: (Card & { boardName: string })[] = [];
  boards.forEach((board) => {
    board.lists.forEach((list) => {
      list.cards.forEach((card) => {
        if (card.member.includes(userId)) {
          filteredCards.push({ ...card, boardName: board.name });
        }
      });
    });
  });
  return filteredCards;
};

interface HeaderFilterProps {
  boards: Board[];
  selectedBoards: string[];
  handleBoardChange: (boardId: string) => void;
  selectedMonth: Date;
  handleMonthChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handlePrevWeek: () => void;
  handleNextWeek: () => void;
  handleTodayClick: () => void;
  toggleBoardSelect: () => void;
  showBoardSelect: boolean;
  handleSelectAllBoards: () => void;
  closeBoardSelect: () => void;
}

const HeaderFilter = ({
  boards,
  selectedBoards,
  handleBoardChange,
  selectedMonth,
  handleMonthChange,
  handlePrevWeek,
  handleNextWeek,
  handleTodayClick,
  toggleBoardSelect,
  showBoardSelect,
  handleSelectAllBoards,
  closeBoardSelect,
}: HeaderFilterProps) => {
  const boardSelectRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (boardSelectRef.current && !boardSelectRef.current.contains(event.target as Node)) {
      closeBoardSelect();
    }
  };

  useEffect(() => {
    if (showBoardSelect) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showBoardSelect]);

  return (
    <div className="bg-sombar text-white p-4 relative">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold text-black">Calendar</h1>
        <button onClick={toggleBoardSelect} className="flex items-center p-2 bg-gray-200 text-black rounded-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm2 4a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zM5 6a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
          Board Select
        </button>
        {showBoardSelect && (
          <div ref={boardSelectRef} className="absolute right-0 top-14 mt-2 bg-white text-black rounded-md shadow-lg p-4">
            <button onClick={handleSelectAllBoards} className="block w-full text-left p-2 hover:bg-gray-200">
              {selectedBoards.length === boards.length ? 'Deselect All' : 'Select All'}
            </button>
            {boards.map((board) => (
              <div key={board.id} className="flex items-center p-2 hover:bg-gray-200">
                <input
                  type="checkbox"
                  id={board.id}
                  checked={selectedBoards.includes(board.id)}
                  onChange={() => handleBoardChange(board.id)}
                  className="mr-2"
                />
                <label htmlFor={board.id}>{board.name}</label>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center">
        <input
          type="month"
          value={selectedMonth.toISOString().slice(0, 7)}
          onChange={handleMonthChange}
          className="p-2 bg-white text-black rounded-md"
        />
        <div className="flex items-center space-x-2 ml-4">
          <button onClick={handlePrevWeek} className="p-2 bg-gray-200 text-black font-bold rounded-md">
            &lt;
          </button>
          <button onClick={handleTodayClick} className="p-2 bg-gray-200 text-black font-bold rounded-md">
            Today
          </button>
          <button onClick={handleNextWeek} className="p-2 bg-gray-200 text-black font-bold rounded-md">
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

interface TaskDateTableProps {
  dates: Date[];
  cards: (Card & { boardName: string })[];
  onCardClick: (card: Card & { boardName: string }) => void;
}

const TaskDateTable = ({ dates, cards, onCardClick }: TaskDateTableProps) => (
  <div className="grid grid-cols-7 gap-0 h-screen">
    {dates.map((date, index) => {
      const dateStr = date.toISOString().split('T')[0];
      const dailyCards = cards.filter(
        (card) => dateStr >= card.date_start && dateStr <= card.date_end
      );

      return (
        <div key={date.toDateString()} className="flex flex-col bg-somon border border-som">
          <div className="text-center font-bold mt-2">{daysOfWeek[index]}</div>
          <div className="text-center">{date.getDate()}</div>
          <div className="flex-grow mt-2">
            {dailyCards.map((card) => (
              <div
                key={card.id}
                className="p-1 mt-1 rounded-md cursor-pointer"
                style={{ backgroundColor: card.color }}
                onClick={() => onCardClick(card)}
              >
                <div className="font-bold">{card.boardName}</div>
                {card.name}
              </div>
            ))}
          </div>
        </div>
      );
    })}
  </div>
);

export default function Calendar() {
  const { data: session } = useSession();
  const userId: string | undefined = session?.user?.id;
  //const userId: string | undefined = "75c8ba78-d371-4ff6-be29-1139cfebf33c";

  const [boards, setBoards] = useState<Board[]>([]);
  const [selectedBoards, setSelectedBoards] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [dates, setDates] = useState<Date[]>(getWeekDates(new Date()));
  const [cards, setCards] = useState<(Card & { boardName: string })[]>([]);
  const [showBoardSelect, setShowBoardSelect] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card & { boardName: string } | null>(null);

  useEffect(() => {
    const LoadBoards = async () => {
      if (!userId) return;

      const data: BoardJSON = await GetBoards();
      const filteredBoards = data.data.filter((board) =>
        board.member.includes(userId)
      );
      setBoards(filteredBoards);
    };

    LoadBoards();
  }, [userId]);
  useEffect(() => {
    setDates(getWeekDates(startDate));
    setSelectedMonth(startDate);
  }, [startDate]);

  useEffect(() => {
    const filteredBoards = boards.filter((board) =>
      selectedBoards.includes(board.id)
    );
    const userCards = filterCardsByUserAndBoard(filteredBoards, userId || '');
    setCards(userCards);
  }, [boards, selectedBoards, userId]);

  const handleBoardChange = (boardId: string) => {
    setSelectedBoards((prevSelected) =>
      prevSelected.includes(boardId)
        ? prevSelected.filter((id) => id !== boardId)
        : [...prevSelected, boardId]
    );
  };

  const handleSelectAllBoards = () => {
    if (selectedBoards.length === boards.length) {
      setSelectedBoards([]);
    } else {
      setSelectedBoards(boards.map((board) => board.id));
    }
  };

  const handleMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(event.target.value);
    setStartDate(new Date(newDate.setDate(1))); // Set start date to the first of the selected month
  };

  const handlePrevWeek = () => {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(startDate.getDate() - 7);
    setStartDate(newStartDate);
  };

  const handleNextWeek = () => {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(startDate.getDate() + 7);
    setStartDate(newStartDate);
  };

  const handleTodayClick = () => {
    const today = new Date();
    setStartDate(today);
  };

  const toggleBoardSelect = () => {
    setShowBoardSelect(!showBoardSelect);
  };

  const closeBoardSelect = () => {
    setShowBoardSelect(false);
  };

  const handleCardClick = (card: Card & { boardName: string }) => {
    setSelectedCard(card);
  };

  const handleClosePopup = () => {
    setSelectedCard(null);
  };

  return (
    <div className="h-full bg-somon ml-64">
      <HeaderFilter
        boards={boards}
        selectedBoards={selectedBoards}
        handleBoardChange={handleBoardChange}
        selectedMonth={selectedMonth}
        handleMonthChange={handleMonthChange}
        handlePrevWeek={handlePrevWeek}
        handleNextWeek={handleNextWeek}
        handleTodayClick={handleTodayClick}
        toggleBoardSelect={toggleBoardSelect}
        showBoardSelect={showBoardSelect}
        handleSelectAllBoards={handleSelectAllBoards}
        closeBoardSelect={closeBoardSelect}
      />
      <TaskDateTable dates={dates} cards={cards} onCardClick={handleCardClick} />
      {selectedCard && (
        <ViewCardPopup
          onClose={handleClosePopup}
          cid={selectedCard.id}
          lid={selectedCard.list}
        />
      )}
    </div>
  );
}