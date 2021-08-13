
document.addEventListener("init", OnCreate);

// função chamada ao inicar a aplicação
function OnCreate(event) {
    let page = event.target;

    let nav = document.querySelector("#nav");

    if(page.id === "main") MainPage(nav, page);
    else if (page.id === "produto") ProdutoPage(nav, page);

}

function getCartStore() {
    let cartStore = localStorage.getItem('free-store-cart-storage');
    cartStore = cartStore ? JSON.parse(cartStore) : [];
    
    return cartStore;
}

function setCartStore(productToAdd) {
    const persistCartStore = cart => localStorage.setItem('free-store-cart-storage', JSON.stringify(cart));
    const cart = getCartStore();
    if (!cart.some(prod => prod.id === productToAdd.id)) {
        productToAdd.quantidade = 1;
        cart.push(productToAdd);
        return persistCartStore(cart);
    }
    return persistCartStore(cart.map(prod => {
        if (prod.id === productToAdd.id) {
            prod.quantidade++;
        }
        return prod;
    }));
}

// função do main
function MainPage(nav, page) {

    let toolbar = page.querySelector("ons-toolbar .center");
    toolbar.innerHTML = appNome; // define o nome do app

    let btninfo = page.querySelector("#btnInfo"); // adiciona o botão resposavel por abrir o dialogo info em uma variavel

    // função onclick do btninfo
    btninfo.onclick = () => {
        page.querySelector("#numero").textContent = WANumero; // define o seu número no dialogo
        page.querySelector("#email").textContent = email; // difine seu email no dialogo
        let dialoginfo = page.querySelector("#info"); // adiciona o dialogo de informações em uma variavel
        dialoginfo.show(); // mostra o dialoginfo

        // adiciona o closeDialogInfo em uma variavel
        let btnCloseDialog = page.querySelector("#closeDialogInfo");
        // função onclick do btnCloseDialog
        btnCloseDialog.onclick = () => {
            dialoginfo.hide(); // esconde o dialoginfo
        }
    };
   
    const btnCarrinho = page.querySelector("#btnCarrinho");

    btnCarrinho.onclick = () => {
        nav.pushPage("carrinho.html");
    };

    // define quais dados seram adicionados aos items da lista
    let dadosItem = {
        valueNames: [
            {name: "imagem", attr: "src"},
            "nome",
            "descricao"
        ],
        item: "listItem"
    };
    
    // "carrega a lista"
    let listaProdutos = new List("listaProdutos", dadosItem);

    // adiciona os produtos na lista
    produtos.forEach( (produto, i) => {
        listaProdutos.add({
            nome: `${produto.nome} - R$${Number(produto.valor).toFixed(2)}`,
            descricao: produto.descricao,
            imagem: produto.imagem,
            id: produto.id
        });
    });

    let items = page.querySelectorAll(".listItem");

    // adiciona onclick em todos os items da lista
    items.forEach( (item, i) => {
        item.addEventListener("click", () => {
            nav.pushPage("produto.html", {
                data: {
                    nome: produtos[i].nome,
                    valor: produtos[i].valor,
                    descricao: produtos[i].descricao,
                    imagem: produtos[i].imagem,
                    id: produtos[i].id
                }
            });
        });
    });

}

// função da página produtos
function ProdutoPage(nav, page) {
    let tituloToolbar = page.querySelector("ons-toolbar .center");
    tituloToolbar.innerHTML = page.data.nome; // define o titulo com o nome do produto

    let textBtnVoltar = page.querySelector("#textBtnVoltar");
    textBtnVoltar.textContent = appNome; // define o texto do botão voltar, apenas IOS

    let img = page.querySelector("img");
    img.setAttribute("src", page.data.imagem); // define a imagem

    let nome = page.querySelector("#nome");
    nome.textContent = page.data.nome; // define o nome do produto

    let valor = page.querySelector("#valor");
    valor.textContent = `R$${Number(page.data.valor).toFixed(2)}`; // define o valor do produto

    let descricao = page.querySelector("#descricao");
    descricao.textContent = page.data.descricao; // define a descrição do produto

    let btnWA = page.querySelector("#btn-whatsapp"); // adiciona o btn-whasapp em uma variavel
    // função onclick do btnWA
    btnWA.onclick = () => {
        openWA();
    };

    // função que direciona o cliente para o WhatsApp do vendedor
    function openWA() {
        let msg = `Olá, estou interessado no produto ${page.data.nome}!\nValor R$${Number(page.data.valor).toFixed(2)}\nEle ainda está disponível?`;
        window.open(`https://api.whatsapp.com/send?phone=${WANumero}&text=${encodeURIComponent(msg)}`, "_blank");
    }

}
