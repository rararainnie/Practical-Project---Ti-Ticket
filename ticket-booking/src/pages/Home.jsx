import Navbar from "../components/navbar";
import RecommendMovie from "../components/recommendMovie";
import ConcertBox from "../components/ConcertBox";
import ShowTheaterAndMovie from "../components/showTheaterAndMovie";

import bp from "../assets/bp.png";
import rv from "../assets/rv.png";
import tw from "../assets/twice.png";

function Home() {
  const handleBuyTickets = () => {
    alert("Tickets purchase functionality is not implemented yet.");
  };

  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <RecommendMovie />
      <ShowTheaterAndMovie />

      <div className="pt-1 w-[60%] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <ConcertBox
            image={bp}
            name="Black Pink"
            date="2024-09-15"
            time="19:00"
            location="Concert Hall, City Center"
            onBuyTickets={handleBuyTickets}
          />
          <ConcertBox
            image={rv}
            name="Red Velvet"
            date="2024-09-15"
            time="19:00"
            location="Concert Hall, City Center"
            onBuyTickets={handleBuyTickets}
          />
          <ConcertBox
            image={tw}
            name="Twice"
            date="2024-09-15"
            time="19:00"
            location="Concert Hall, City Center"
            onBuyTickets={handleBuyTickets}
          />
          <ConcertBox
            image={bp}
            name="Black Pink"
            date="2024-09-15"
            time="19:00"
            location="Concert Hall, City Center"
            onBuyTickets={handleBuyTickets}
          />
          <ConcertBox
            image={rv}
            name="Red Velvet"
            date="2024-09-15"
            time="19:00"
            location="Concert Hall, City Center"
            onBuyTickets={handleBuyTickets}
          />
          <ConcertBox
            image={tw}
            name="Twice"
            date="2024-09-15"
            time="19:00"
            location="Concert Hall, City Center"
            onBuyTickets={handleBuyTickets}
          />
          <ConcertBox
            image={bp}
            name="Black Pink"
            date="2024-09-15"
            time="19:00"
            location="Concert Hall, City Center"
            onBuyTickets={handleBuyTickets}
          />
          <ConcertBox
            image={rv}
            name="Red Velvet"
            date="2024-09-15"
            time="19:00"
            location="Concert Hall, City Center"
            onBuyTickets={handleBuyTickets}
          />
          <ConcertBox
            image={tw}
            name="Twice"
            date="2024-09-15"
            time="19:00"
            location="Concert Hall, City Center"
            onBuyTickets={handleBuyTickets}
          />
          <ConcertBox
            image={bp}
            name="Black Pink"
            date="2024-09-15"
            time="19:00"
            location="Concert Hall, City Center"
            onBuyTickets={handleBuyTickets}
          />
          <ConcertBox
            image={rv}
            name="Red Velvet"
            date="2024-09-15"
            time="19:00"
            location="Concert Hall, City Center"
            onBuyTickets={handleBuyTickets}
          />
          <ConcertBox
            image={tw}
            name="Twice"
            date="2024-09-15"
            time="19:00"
            location="Concert Hall, City Center"
            onBuyTickets={handleBuyTickets}
          />
          <ConcertBox
            image={bp}
            name="Black Pink"
            date="2024-09-15"
            time="19:00"
            location="Concert Hall, City Center"
            onBuyTickets={handleBuyTickets}
          />
          <ConcertBox
            image={rv}
            name="Red Velvet"
            date="2024-09-15"
            time="19:00"
            location="Concert Hall, City Center"
            onBuyTickets={handleBuyTickets}
          />
          <ConcertBox
            image={tw}
            name="Twice"
            date="2024-09-15"
            time="19:00"
            location="Concert Hall, City Center"
            onBuyTickets={handleBuyTickets}
          />
          <ConcertBox
            image={bp}
            name="Black Pink"
            date="2024-09-15"
            time="19:00"
            location="Concert Hall, City Center"
            onBuyTickets={handleBuyTickets}
          />
          <ConcertBox
            image={rv}
            name="Red Velvet"
            date="2024-09-15"
            time="19:00"
            location="Concert Hall, City Center"
            onBuyTickets={handleBuyTickets}
          />
          <ConcertBox
            image={tw}
            name="Twice"
            date="2024-09-15"
            time="19:00"
            location="Concert Hall, City Center"
            onBuyTickets={handleBuyTickets}
          />
          <ConcertBox
            image={bp}
            name="Black Pink"
            date="2024-09-15"
            time="19:00"
            location="Concert Hall, City Center"
            onBuyTickets={handleBuyTickets}
          />
          <ConcertBox
            image={rv}
            name="Red Velvet"
            date="2024-09-15"
            time="19:00"
            location="Concert Hall, City Center"
            onBuyTickets={handleBuyTickets}
          />
          <ConcertBox
            image={tw}
            name="Twice"
            date="2024-09-15"
            time="19:00"
            location="Concert Hall, City Center"
            onBuyTickets={handleBuyTickets}
          />
          <ConcertBox
            image={bp}
            name="Black Pink"
            date="2024-09-15"
            time="19:00"
            location="Concert Hall, City Center"
            onBuyTickets={handleBuyTickets}
          />
          <ConcertBox
            image={rv}
            name="Red Velvet"
            date="2024-09-15"
            time="19:00"
            location="Concert Hall, City Center"
            onBuyTickets={handleBuyTickets}
          />
          <ConcertBox
            image={tw}
            name="Twice"
            date="2024-09-15"
            time="19:00"
            location="Concert Hall, City Center"
            onBuyTickets={handleBuyTickets}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
