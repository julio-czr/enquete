

CREATE TABLE `enquete` (
  `id` int(11) NOT NULL,
  `nome` varchar(30) NOT NULL,
  `dataInicial` date NOT NULL,
  `dataFim` date NOT NULL
) 


CREATE TABLE `opcoes` (
  `id` int(11) NOT NULL,
  `enquete_id` int(11) NOT NULL,
  `opcao` varchar(50) NOT NULL,
  `votos` int(11) NOT NULL DEFAULT 0
) 

ALTER TABLE `enquete`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `opcoes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `enquete_id` (`enquete_id`);

ALTER TABLE `enquete`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

ALTER TABLE `opcoes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=232;

ALTER TABLE `opcoes`
  ADD CONSTRAINT `opcoes_ibfk_1` FOREIGN KEY (`enquete_id`) REFERENCES `enquete` (`id`) ON DELETE CASCADE;
COMMIT;

