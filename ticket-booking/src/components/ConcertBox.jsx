import PropTypes from "prop-types";

function ConcertBox({ image, name, date, time, location, onBuyTickets }) {
  return (
    <div className="mt-3 ml-2 p-2 bg-zinc-900 rounded-3xl max-w-lg">
      <div className="flex">
        <img src={image} alt={name} className="w-[40%] rounded-3xl" />
        <div className="ml-3 flex flex-col ">
          <div>
            <h2 className="text-lg font-extrabold text-white">{name}</h2>
            <p className="text-sm text-yellow-500 mt-3">
              <strong>Date:</strong> {date}
            </p>
            <p className="text-sm text-yellow-500  mt-1">
              <strong>Time:</strong> {time}
            </p>
            <p className="text-sm text-blue-300 mt-1">
              <strong>Location:</strong> {location}
            </p>
          </div>

          <div className="boarder border-[1px] border-red-500 opacity-20 mt-3"></div>

          <button
            onClick={onBuyTickets}
            className="mt-3 w-20 h-9 bg-red-500 text-white font-semibold rounded-3xl hover:bg-black text-sm"
          >
            ซื้อบัตร
          </button>
        </div>
      </div>
    </div>
  );
}

ConcertBox.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  onBuyTickets: PropTypes.func.isRequired,
};

export default ConcertBox;
