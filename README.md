letrilizar
==========

Transforme qualquer trecho da sua página em uma citação e compartilhe!

Vem com alguns estilos pré-definidos e compartilhamento no Facebook.


Live Demo: http://globocom.github.io/letrilizar/


O uso é intuitivo, basta incluir o script na página e chamar:

```
Letrilizar.letrilizar();
```

Existem também algumas opções de configurações, todas autoexplicativas:

```
Letrilizar.letrilizar({
        el: $('.letrilizar'),
        sharingText: 'Estamos postando a foto no seu facebook...',
        successText: 'Sua foto foi postada. É só curtir!',
        errorText: 'Ops... ocorreu um erro',
        subtitle1: 'Letrilizar',
        subtitle2: 'GLOBOCOM.GITHUB.IO/LETRILIZAR/',
        imageSrcPrefix: 'images/'
  });
```

