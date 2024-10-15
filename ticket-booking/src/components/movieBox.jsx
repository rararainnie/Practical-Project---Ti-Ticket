import PropTypes from "prop-types";

function MovieBox({ image, name, date, time }) {
  return (
    <div className="mt-3 ml-2 p-2 bg-zinc-900 rounded-3xl max-w-lg">
      <div className="flex flex-col text-center items-center">
        <img
          src={image}
          alt={name}
          className="h-[400px] rounded-3xl object-cover"
        />

        <div className="ml-3 flex flex-col mt-3">
          <div>
            <h2 className="text-lg font-extrabold text-white">{name}</h2>
            <p className="text-sm text-yellow-500 mt-3">
              <strong>Date:</strong> {date}
            </p>
            <p className="text-sm text-yellow-500  mt-1">
              <strong>Time:</strong> {time}
            </p>
          </div>

          {/* <div className="boarder border-[1px] border-red-500 opacity-20 mt-3"></div> */}

          {/* <button
            onClick={onBuyTickets}
            className="mt-3 w-20 h-9 bg-red-500 text-white font-semibold rounded-3xl hover:bg-black text-sm"
          >
            ซื้อบัตร
          </button> */}
        </div>
      </div>
    </div>
  );
}

MovieBox.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
};

export default MovieBox;
