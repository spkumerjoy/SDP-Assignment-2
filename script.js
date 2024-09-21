const spinner = document.getElementById("loading-spinner");
const playersContainer = document.getElementById("players-container");
let addedPlayersIds = new Set();

spinner.classList.remove("d-none");

// Player Cards Design
const playerCards = (player, btnAddCartTxt, btnStatus) => {
    const playerCard = `
                <div class="col-md-6 col-lg-4">
                    <div class="card shadow-lg border-0 mb-4 player-cards">
                        <img src="${
                            player.strThumb
                        }" class="card-img-top" alt="${player.strPlayer}"/>
                        <div class="card-body cd-bg">
                            <h5 class="card-title fw-bold text-primary">${
                                player.strPlayer
                            }</h5>
                            <p class="card-text text-muted">${
                                player.strDescriptionEN
                                    ? player.strDescriptionEN.slice(0, 100)
                                    : "not found"
                            }</p>
                        </div>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item bg-light">
                                <div class="d-flex justify-content-between fw-medium">
                                    <p class="mb-0 text-primary-emphasis"><span class="fst-italic">Nationality:
                                        </span>${
                                            player.strNationality || "not found"
                                        }</p>
                                    <p class="mb-0 text-primary-emphasis"><span class="fst-italic">Team:
                                        </span>${
                                            player.strTeam || "not found"
                                        }</p>
                                </div>
                            </li>
                            <li class="list-group-item bg-light">
                                <div class="d-flex justify-content-between fw-medium">
                                    <p class="mb-0 text-primary-emphasis"><span class="fst-italic">Gender:
                                        </span>${
                                            player.strGender || "not found"
                                        }</p>
                                    <p class="mb-0 text-primary-emphasis"><span class="fst-italic">Sport:
                                        </span>${
                                            player.strSport || "not found"
                                        }</p>
                                </div>
                            </li>
                            <li class="list-group-item bg-light text-primary-emphasis">
                                <span class="fst-italic">Salary: </span>${
                                    player.strWage || "not found"
                                }
                            </li>
                            <li class="list-group-item bg-light">
                                <div class="d-flex justify-content-center fw-bold fs-4">
                                    <a href="https://${
                                        player.strFacebook
                                    }" class="mx-3 text-primary" target="_blank"><i
                                            class="fa-brands fa-facebook-f"></i></a>
                                    <a href="https://${
                                        player.strTwitter
                                    }" class="mx-3 text-info" target="_blank"><i class="fa-brands fa-twitter"></i></a>
                                    <a href="https://${
                                        player.strInstagram
                                    }" class="mx-3 text-danger" target="_blank"><i class="fa-brands fa-instagram"></i></a>
                                </div>
                            </li>
                        </ul>
                        <div class="card-body d-flex justify-content-between cd-bg">
                            <button class="btn my-btn-primary shadow-sm my-btn border-0 add-to-cart-btn" player-id="${
                                player.idPlayer
                            }" ${btnStatus}>${btnAddCartTxt}</button>
                            <button class="btn my-btn-success shadow-sm my-btn border-0 view-details-btn" data-bs-toggle="modal" data-bs-target="#staticBackdrop" player-id="${
                                player.idPlayer
                            }">View
                                    Details</button>
                        </div>
                    </div>
                </div>
            `;
    playersContainer.innerHTML += playerCard;
};

// Show Default 10 Players Data
fetch("https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=")
    .then((res) => res.json())
    .then((data) => {
        data.player.slice(0, 10).forEach((player) => {
            playerCards(player, "Add To Cart", "");
        });
    })
    .catch((error) => {
        playersContainer.innerHTML = `<p class="text-center fs-4 fw-bold text-danger my-5">${error}!!!</p>`;
    })
    .finally(() => {
        spinner.classList.add("d-none");
    });

// Search and show functions
document
    .getElementById("btn-search")
    .addEventListener("click", function (event) {
        event.preventDefault();

        const searchInput = document
            .getElementById("search-field")
            .value.toLowerCase()
            .trim();

        playersContainer.innerHTML = "";

        handleSearchPlayer(searchInput);
    });

const handleSearchPlayer = (searchInput) => {
    spinner.classList.remove("d-none");
    fetch(
        `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${searchInput}`
    )
        .then((res) => res.json())
        .then((data) => {
            if (data.player) {
                data.player.forEach((player) => {
                    if (addedPlayersIds.has(player.idPlayer)) {
                        playerCards(player, "Player Added", "disabled");
                    } else {
                        playerCards(player, "Add To Cart", "");
                    }
                });
            } else {
                playersContainer.innerHTML =
                    '<p class="text-center fs-4 fw-bold text-danger my-5">No Data Found!!!</p>';
            }
        })
        .catch((error) => {
            playersContainer.innerHTML = `<p class="text-center fs-4 fw-bold text-danger my-5">${error}!!!</p>`;
        })
        .finally(() => {
            spinner.classList.add("d-none");
        });
};

// Add To Cart Functions

let playerCount = 0;
const playerCountElement = document.getElementById("player-count");

document.addEventListener("click", function (event) {
    if (event.target.classList.contains("add-to-cart-btn")) {
        const playerId = event.target.getAttribute("player-id");
        handleAddToCart(playerId, event.target);
    } else if (event.target.classList.contains("remove-player-btn")) {
        const playerItem = event.target.closest("li");
        const playerId = playerItem.getAttribute("data-player-id");
        playerItem.remove();

        playerCount--;
        playerCountElement.innerText = playerCount;

        const addToCartBtn = document.querySelector(
            `.add-to-cart-btn[player-id="${playerId}"]`
        );
        if (addToCartBtn) {
            addToCartBtn.innerText = "Add to Cart";
            addToCartBtn.disabled = false;
        }
    }
});

const handleAddToCart = (playerId, btn) => {
    let cartList = document.querySelector(".cart-list");
    fetch(
        `https://www.thesportsdb.com/api/v1/json/3/lookupplayer.php?id=${playerId}`
    )
        .then((res) => res.json())
        .then((data) => {
            const player = data.players[0];
            if (playerCount < 11) {
                const playerList = `
                <li data-player-id="${playerId}">
                    <div class="d-flex justify-content-between align-items-center">
                        <p>${player.strPlayer}</p>
                        <p>${
                            player?.strSport || "not found"
                        } <i class="fa-regular fa-circle-xmark text-danger fs-4 fw-bold c-pointer remove-player-btn"></i></p>
                    </div>
                </li>
            `;
                cartList.innerHTML += playerList;
                playerCount++;
                playerCountElement.innerText = playerCount;
                btn.innerText = "Player Added";
                btn.disabled = true;
                addedPlayersIds.add(playerId);
            } else {
                alert(
                    "You Have Already Added 11 Players, You Can't Add More Than 11 Player!!!"
                );
                return;
            }
        })
        .catch((error) => {
            alert(error);
        });
};

// Show Modal function
document.addEventListener("click", function (event) {
    if (event.target.classList.contains("view-details-btn")) {
        const playerId = event.target.getAttribute("player-id");
        handleShowPlayerDetails(playerId);
    }
});

const handleShowPlayerDetails = (playerId) => {
    let modalContainer = document.querySelector(
        "#staticBackdrop .modal-dialog"
    );
    fetch(
        `https://www.thesportsdb.com/api/v1/json/3/lookupplayer.php?id=${playerId}`
    )
        .then((res) => res.json())
        .then((data) => {
            const player = data.players[0];
            const modalContent = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-4 fw-bold text-primary-emphasis" id="staticBackdropLabel">${
                            player.strPlayer
                        }</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
                    <div class="modal-body cd-bg">
                        <div class="d-flex justify-content-center align-items-center">
                            <img src="${player.strThumb}" alt="${
                player.strPlayer
            }" class="img-fluid mb-3" />
                        </div>
                        <div class="d-flex justify-content-between fw-medium">
                            <p><strong>Sport:</strong> ${
                                player?.strSport || "not found"
                            }</p>
                            <p><strong>Team:</strong> ${
                                player?.strTeam || "not found"
                            }</p>
                        </div>
                        <div class="d-flex justify-content-between fw-medium">
                            <p><strong>Height:</strong> ${
                                player?.strHeight || "not found"
                            }</p>
                            <p><strong>Weight:</strong> ${
                                player?.strWeight || "not found"
                            }</p>
                        </div>
                        <p><strong>Description:</strong> ${
                            player.strDescriptionEN ||
                            "No description available"
                        }</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            `;
            modalContainer.innerHTML = modalContent;
        })
        .catch((error) => {
            modalContainer.innerHTML = `<p class="text-center fs-4 fw-bold text-danger my-5">${error}!!!</p>`;
        });
};
