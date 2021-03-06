import AbstractSmartComponent from '@components/abstract-smart-component.js';
import {formatTime, formatDateFull, formatDateFormComments} from '@src/utils/common.js';
import CommentModel from '@src/models/comment.js';
import {encode} from 'he';
import {isOnline} from '@src/api/provider.js';

const OFFLINE = `offline`;

const SHAKE_ANIMATION_TIMEOUT = 600;
const AMOUNT_MILISECONDS_IN_SECOND = 1000;

export const ButtonTexts = {
  DELETE: `Delete`,
  DELETING: `Deleting...`
};

const createTemplate = (data, comments) => {
  const time = formatTime(data.duration);
  const date = formatDateFull(data.date);

  const replaceGenre = () => {
    const genre = data.genre.length > 1 ? `Genres` : `Genre`;
    return genre;
  };

  return (
    `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="form-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${data.poster}" alt="">

            <p class="film-details__age">${data.pg}</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${data.name}</h3>
                <p class="film-details__title-original">Original: ${data.name}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${data.rating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${data.director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${data.writers}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${data.actors}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${date}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${time}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${data.country}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">${replaceGenre()}</td>
                <td class="film-details__cell">${data.genre.map((it)=>`<span class="film-details__genre">${it}</span>`).join(``)}</td>
              </tr>
            </table>

            <p class="film-details__film-description">${data.description}</p>
          </div>
        </div>

        <section class="film-details__controls">
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${data.isInWatchlist ? `checked` : ``}>
          <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${data.isWatched ? `checked` : ``}>
          <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${data.isFavorite ? `checked` : ``}>
          <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
        </section>
      </div>

      <div class="form-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${data.comments.length}</span></h3>

          <ul class="film-details__comments-list">
          ${data.comments.map((it) => `<li class="film-details__comment" data-id=${it}>
          <span class="film-details__comment-emoji">
            <img src="./images/emoji/${comments[it].emoji}.png" width="55" height="55" alt="emoji-${comments[it].alt}">
          </span>
          <div>
            <p class="film-details__comment-text">${encode(comments[it].text)}</p>
            <p class="film-details__comment-info">
              <span class="film-details__comment-author">${comments[it].author}</span>
              <span class="film-details__comment-day">${formatDateFormComments(comments[it].date)}</span>
              <button class="film-details__comment-delete">Delete</button>
            </p>
          </div>
        </li>`).join(``)}
          </ul>

          <div class="film-details__new-comment">
            <div for="add-emoji" class="film-details__add-emoji-label"></div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
            </label>

            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`
  );
};

export default class Popup extends AbstractSmartComponent {
  constructor(data, comments) {
    super();

    this._data = data;
    this._comments = comments;
    this._newComment = {
      text: ``,
      emoji: ``,
      alt: ``
    };
    this._externalData = ButtonTexts;
    this.disableComments = false;

    this._popupClickHandler = null;
    this._submitHandler = null;
    this._deleteCommentHandler = null;
    this._controlWatchlistHandler = null;
    this._controlWatchedHandler = null;
    this._controlFavoriteHandler = null;

    this._subscribeOnEvents();
  }

  getTemplate() {
    return createTemplate(this._data, this._comments, this._externalData);
  }

  recoveryListeners() {
    this._onlineHandler = this._onlineHandler.bind(this);
    this._subscribeOnEvents();
    this.setSubmitHandler(this._submitHandler);
    this.setDeleteCommentHandler(this._deleteCommentHandler);
    this.setControlWatchlistHandler(this._controlWatchlistHandler);
    this.setControlWatchedHandler(this._controlWatchedHandler);
    this.setControlFavoriteHandler(this._controlFavoriteHandler);
    this.setClickPopupHandler(this._popupClickHandler);
  }

  rerender() {
    super.rerender();
  }

  removeElement() {
    super.removeElement();

    window.removeEventListener(`offline`, this._onlineHandler);
    window.removeEventListener(`online`, this._onlineHandler);
  }

  reset() {
    this._newComment.text = ``;

    this.rerender();

    if (!isOnline()) {

      this.disableForm(true);
      this._disableDeleteButtons(true);
    }
  }

  getNewComment() {
    return new CommentModel({
      "comment": this._newComment.text,
      "date": new Date(),
      "author": ``,
      "emotion": this._newComment.emoji
    });
  }

  setData(data) {
    this._externalData = Object.assign({}, ButtonTexts, data);
    this.rerender();
  }

  shakeForm() {
    const form = this.getElement().querySelector(`.film-details__inner`);
    form.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / AMOUNT_MILISECONDS_IN_SECOND}s`;

    setTimeout(() => {
      form.style.animation = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  shakeComment(id) {
    const comment = this.getElement().querySelector(`[data-id="${id}"]`);
    const deleteButton = comment.querySelector(`.film-details__comment-delete`);
    deleteButton.disabled = false;
    deleteButton.innerText = ButtonTexts.DELETE;

    comment.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / AMOUNT_MILISECONDS_IN_SECOND}s`;

    setTimeout(() => {
      comment.style.animation = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  disableForm(value) {
    const input = this.getElement().querySelector(`.film-details__comment-input`);
    const radioInputs = Array.from(this.getElement().querySelectorAll(`.film-details__emoji-item`));

    input.disabled = value;

    radioInputs.forEach((it) => {
      it.disabled = value;
    });
  }

  _disableDeleteButtons(value) {
    const deleteButtons = Array.from(this.getElement().querySelectorAll(`.film-details__comment-delete`));

    deleteButtons.forEach((it) => {
      it.disabled = value;
    });
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    const smileInputArray = Array.from(element.querySelectorAll(`.film-details__emoji-item`));

    smileInputArray.forEach((it) => {
      it.addEventListener(`change`, (evt) => {
        const label = element.querySelector(`label[for="${evt.target.id}"]`);
        const image = label.firstElementChild.cloneNode();

        const putPlaceContainer = element.querySelector(`.film-details__add-emoji-label`);
        putPlaceContainer.innerHTML = ``;
        this._newComment.emoji = `${evt.target.value}`;
        putPlaceContainer.appendChild(image);
      });
    });

    element.querySelector(`.film-details__comment-input`).addEventListener(`input`, (evt) => {
      this._newComment.text = evt.target.value;
    });

    window.addEventListener(`online`, this._onlineHandler.bind(this));
    window.addEventListener(`offline`, this._onlineHandler.bind(this));
  }

  setClickPopupHandler(handler) {
    const closeBtn = this.getElement().querySelector(`.film-details__close-btn`);

    closeBtn.addEventListener(`click`, handler);

    this._popupClickHandler = handler;
  }

  setSubmitHandler(handler) {
    this.getElement().querySelector(`form`).addEventListener(`keydown`, handler);

    this._submitHandler = handler;
  }

  setDeleteCommentHandler(handler) {
    const deleteButtons = Array.from(this.getElement().querySelectorAll(`.film-details__comment-delete`));

    deleteButtons.forEach((it) => {
      it.addEventListener(`click`, handler);
    });

    this._deleteCommentHandler = handler;
  }

  setControlWatchlistHandler(handler) {
    const checkbox = this.getElement().querySelector(`#watchlist`);

    checkbox.addEventListener(`change`, handler);

    this._controlWatchlistHandler = handler;
  }

  setControlWatchedHandler(handler) {
    const checkbox = this.getElement().querySelector(`#watched`);

    checkbox.addEventListener(`change`, handler);

    this._controlWatchedHandler = handler;
  }

  setControlFavoriteHandler(handler) {
    const checkbox = this.getElement().querySelector(`#favorite`);

    checkbox.addEventListener(`change`, handler);

    this._controlFavoriteHandler = handler;
  }

  _onlineHandler(evt) {
    const disabled = evt.type === OFFLINE;

    this.disableForm(disabled);
    this._disableDeleteButtons(disabled);
  }
}

