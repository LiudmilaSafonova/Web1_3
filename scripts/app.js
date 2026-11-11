function createAppLayout() {
    const main = document.createElement('main');
    main.className = 'todo-app';

    const header = document.createElement('header');
    header.className = 'todo-app__header';

    const title = document.createElement('h1');
    title.textContent = '2048';

    const score = document.createElement('div');

    const scoreLabel = document.createElement('span');
    scoreLabel.textContent = 'score';

    const scoreValue = document.createElement('output');
    scoreValue.id = 'score';
    scoreValue.textContent = '0';

    score.append(scoreLabel, scoreValue);

    header.append(title, score);
    main.append(header);
    document.body.append(main);

}

elements = createAppLayout()



