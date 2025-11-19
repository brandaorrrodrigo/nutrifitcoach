-- =============================================
-- SEED DE ALIMENTOS BRASILEIROS
-- Baseado na Tabela TACO - 47 alimentos
-- =============================================

-- Deletar alimentos existentes (se quiser resetar)
-- DELETE FROM "Food";

-- ============================================
-- PROTEÍNAS - CARNES
-- ============================================

INSERT INTO "Food" ("id", "name", "category", "calories", "protein", "carbs", "fat", "fiber", "sodium", "common_portion", "common_portion_grams", "is_common", "is_brazilian", "tags", "created_at") VALUES
('frango_peito_grelhado', 'Frango, peito, grelhado', 'protein', 165, 31, 0, 3.6, 0, 63, '1 filé médio', 120, true, true, ARRAY['frango', 'ave', 'magro', 'grelhado'], CURRENT_TIMESTAMP),
('frango_peito_cozido', 'Frango, peito, cozido', 'protein', 159, 32, 0, 3, 0, 60, '1 filé médio', 120, true, true, ARRAY['frango', 'ave', 'magro', 'cozido'], CURRENT_TIMESTAMP),
('carne_bovina_patinho_grelhado', 'Carne bovina, patinho, grelhado', 'protein', 219, 36, 0, 7.5, 0, 57, '1 bife médio', 100, true, true, ARRAY['carne', 'boi', 'magro'], CURRENT_TIMESTAMP),
('carne_bovina_alcatra_grelhada', 'Carne bovina, alcatra, grelhada', 'protein', 242, 30, 0, 13, 0, 59, '1 bife médio', 100, true, true, ARRAY['carne', 'boi'], CURRENT_TIMESTAMP),
('carne_moida_magra_refogada', 'Carne moída, magra, refogada', 'protein', 219, 26, 0, 12, 0, 64, '1 concha', 100, true, true, ARRAY['carne', 'boi', 'moída'], CURRENT_TIMESTAMP),
('peixe_tilapia_grelhada', 'Peixe, tilápia, grelhada', 'protein', 128, 26, 0, 2.7, 0, 52, '1 filé', 120, true, true, ARRAY['peixe', 'magro', 'grelhado'], CURRENT_TIMESTAMP),
('peixe_salmao_grelhado', 'Peixe, salmão, grelhado', 'protein', 211, 29, 0, 10, 0, 59, '1 filé', 120, true, false, ARRAY['peixe', 'ômega3'], CURRENT_TIMESTAMP),
('ovo_de_galinha_inteiro_cozido', 'Ovo de galinha, inteiro, cozido', 'protein', 155, 13, 1.1, 11, 0, 124, '1 unidade média', 50, true, true, ARRAY['ovo', 'cozido'], CURRENT_TIMESTAMP),
('ovo_de_galinha_clara_cozida', 'Ovo de galinha, clara, cozida', 'protein', 52, 11, 0.7, 0.2, 0, 166, '1 unidade', 33, true, true, ARRAY['ovo', 'clara', 'magro'], CURRENT_TIMESTAMP),
('peru_peito_fatiado', 'Peru, peito, fatiado', 'protein', 103, 22, 1.2, 1.2, 0, 1050, '3 fatias', 30, true, true, ARRAY['peru', 'ave', 'magro', 'frio'], CURRENT_TIMESTAMP),
('whey_protein_media', 'Whey Protein (média)', 'protein', 120, 24, 3, 1.5, 0, 100, '1 scoop', 30, true, false, ARRAY['whey', 'proteína', 'suplemento'], CURRENT_TIMESTAMP);

-- ============================================
-- CARBOIDRATOS - GRÃOS E CEREAIS
-- ============================================

INSERT INTO "Food" ("id", "name", "category", "calories", "protein", "carbs", "fat", "fiber", "sodium", "common_portion", "common_portion_grams", "is_common", "is_brazilian", "tags", "created_at") VALUES
('arroz_branco_cozido', 'Arroz branco, cozido', 'carbohydrate', 130, 2.5, 28, 0.2, 0.3, 1, '1 escumadeira', 100, true, true, ARRAY['arroz', 'cozido', 'básico'], CURRENT_TIMESTAMP),
('arroz_integral_cozido', 'Arroz integral, cozido', 'carbohydrate', 124, 2.6, 26, 1, 2.7, 1, '1 escumadeira', 100, true, true, ARRAY['arroz', 'integral', 'cozido'], CURRENT_TIMESTAMP),
('batata_doce_cozida', 'Batata doce, cozida', 'carbohydrate', 77, 0.6, 18, 0.1, 2.2, 27, '1 unidade média', 100, true, true, ARRAY['batata', 'doce', 'cozida', 'tuberculo'], CURRENT_TIMESTAMP),
('batata_inglesa_cozida', 'Batata inglesa, cozida', 'carbohydrate', 52, 1.2, 11, 0.1, 1.3, 5, '1 unidade média', 100, true, true, ARRAY['batata', 'inglesa', 'cozida'], CURRENT_TIMESTAMP),
('mandioca_cozida', 'Mandioca, cozida', 'carbohydrate', 125, 0.6, 30, 0.3, 1.6, 2, '1 pedaço médio', 100, true, true, ARRAY['mandioca', 'aipim', 'macaxeira', 'cozida'], CURRENT_TIMESTAMP),
('macarrao_massa_cozida', 'Macarrão, massa cozida', 'carbohydrate', 135, 5, 26, 0.9, 1.2, 1, '1 escumadeira', 100, true, true, ARRAY['macarrão', 'massa', 'cozida'], CURRENT_TIMESTAMP),
('macarrao_integral_cozido', 'Macarrão integral, cozido', 'carbohydrate', 117, 5, 23, 1.3, 4, 4, '1 escumadeira', 100, true, true, ARRAY['macarrão', 'integral', 'cozida'], CURRENT_TIMESTAMP),
('pao_frances', 'Pão francês', 'carbohydrate', 300, 8, 58, 3.3, 2.3, 648, '1 unidade', 50, true, true, ARRAY['pão', 'francês'], CURRENT_TIMESTAMP),
('pao_integral', 'Pão integral', 'carbohydrate', 253, 8.4, 49, 3.3, 6.9, 524, '2 fatias', 50, true, true, ARRAY['pão', 'integral'], CURRENT_TIMESTAMP),
('tapioca_crepioca_ovo_tapioca', 'Tapioca, crepioca (ovo + tapioca)', 'carbohydrate', 180, 6, 30, 4, 0.5, 80, '1 unidade', 80, true, true, ARRAY['tapioca', 'crepioca', 'ovo'], CURRENT_TIMESTAMP),
('aveia_em_flocos', 'Aveia em flocos', 'carbohydrate', 394, 13.9, 66.6, 8.5, 9.1, 5, '3 colheres de sopa', 30, true, true, ARRAY['aveia', 'cereal', 'fibra'], CURRENT_TIMESTAMP);

-- ============================================
-- LEGUMINOSAS
-- ============================================

INSERT INTO "Food" ("id", "name", "category", "calories", "protein", "carbs", "fat", "fiber", "sodium", "common_portion", "common_portion_grams", "is_common", "is_brazilian", "tags", "created_at") VALUES
('feijao_preto_cozido', 'Feijão preto, cozido', 'legume', 77, 4.5, 14, 0.5, 8.4, 2, '1 concha', 100, true, true, ARRAY['feijão', 'preto', 'cozido'], CURRENT_TIMESTAMP),
('feijao_carioca_cozido', 'Feijão carioca, cozido', 'legume', 76, 4.8, 13.6, 0.5, 8.5, 2, '1 concha', 100, true, true, ARRAY['feijão', 'carioca', 'cozido'], CURRENT_TIMESTAMP),
('lentilha_cozida', 'Lentilha, cozida', 'legume', 93, 6.3, 16, 0.5, 7.9, 2, '1 concha', 100, true, true, ARRAY['lentilha', 'cozida'], CURRENT_TIMESTAMP),
('grao_de_bico_cozido', 'Grão de bico, cozido', 'legume', 121, 6.8, 19.7, 1.7, 7.6, 5, '1 concha', 100, true, true, ARRAY['grão', 'bico', 'cozido'], CURRENT_TIMESTAMP);

-- ============================================
-- VEGETAIS E VERDURAS
-- ============================================

INSERT INTO "Food" ("id", "name", "category", "calories", "protein", "carbs", "fat", "fiber", "sodium", "common_portion", "common_portion_grams", "is_common", "is_brazilian", "tags", "created_at") VALUES
('brocolis_cozido', 'Brócolis, cozido', 'vegetable', 25, 2.4, 4.1, 0.2, 3.1, 25, '1 xícara', 80, true, true, ARRAY['brócolis', 'verde', 'cozido'], CURRENT_TIMESTAMP),
('couve_flor_cozida', 'Couve-flor, cozida', 'vegetable', 20, 1.6, 3.5, 0.3, 2.3, 13, '1 xícara', 80, true, true, ARRAY['couve', 'flor', 'cozida'], CURRENT_TIMESTAMP),
('alface_crespa_crua', 'Alface, crespa, crua', 'vegetable', 11, 1.3, 1.7, 0.2, 2.1, 9, '2 folhas', 20, true, true, ARRAY['alface', 'folha', 'crua', 'salada'], CURRENT_TIMESTAMP),
('tomate_cru', 'Tomate, cru', 'vegetable', 15, 1.1, 3.1, 0.2, 1.2, 4, '1 unidade média', 80, true, true, ARRAY['tomate', 'cru', 'salada'], CURRENT_TIMESTAMP),
('cenoura_crua', 'Cenoura, crua', 'vegetable', 34, 1.3, 7.7, 0.2, 3.2, 42, '1 unidade média', 100, true, true, ARRAY['cenoura', 'crua', 'salada'], CURRENT_TIMESTAMP),
('pepino_cru', 'Pepino, cru', 'vegetable', 10, 0.6, 2.2, 0.1, 0.6, 2, '1/2 unidade', 100, true, true, ARRAY['pepino', 'cru', 'salada'], CURRENT_TIMESTAMP),
('abobrinha_cozida', 'Abobrinha, cozida', 'vegetable', 20, 1.2, 4.3, 0.2, 2.1, 3, '1 porção', 100, true, true, ARRAY['abobrinha', 'cozida'], CURRENT_TIMESTAMP),
('espinafre_refogado', 'Espinafre, refogado', 'vegetable', 28, 2.9, 4.2, 0.4, 3.3, 76, '1 colher de servir', 50, true, true, ARRAY['espinafre', 'verde', 'refogado'], CURRENT_TIMESTAMP),
('couve_refogada', 'Couve, refogada', 'vegetable', 29, 3.3, 4.5, 0.5, 3.6, 18, '1 colher de servir', 50, true, true, ARRAY['couve', 'verde', 'refogada'], CURRENT_TIMESTAMP);

-- ============================================
-- FRUTAS
-- ============================================

INSERT INTO "Food" ("id", "name", "category", "calories", "protein", "carbs", "fat", "fiber", "sodium", "common_portion", "common_portion_grams", "is_common", "is_brazilian", "tags", "created_at") VALUES
('banana_prata_crua', 'Banana, prata, crua', 'fruit', 98, 1.3, 26, 0.1, 2, 1, '1 unidade média', 60, true, true, ARRAY['banana', 'prata'], CURRENT_TIMESTAMP),
('maca_crua', 'Maçã, crua', 'fruit', 63, 0.3, 17, 0.2, 1.3, 1, '1 unidade média', 100, true, true, ARRAY['maçã'], CURRENT_TIMESTAMP),
('morango_cru', 'Morango, cru', 'fruit', 30, 0.9, 6.8, 0.3, 1.7, 1, '5 unidades', 100, true, true, ARRAY['morango', 'berry'], CURRENT_TIMESTAMP),
('mamao_papaya_cru', 'Mamão papaya, cru', 'fruit', 40, 0.8, 10, 0.1, 1.8, 3, '1 fatia', 100, true, true, ARRAY['mamão', 'papaya'], CURRENT_TIMESTAMP),
('abacaxi_cru', 'Abacaxi, cru', 'fruit', 48, 1.2, 12, 0.1, 1.3, 1, '1 rodela', 100, true, true, ARRAY['abacaxi'], CURRENT_TIMESTAMP),
('melancia_crua', 'Melancia, crua', 'fruit', 33, 0.9, 8, 0.2, 0.3, 1, '1 fatia', 200, true, true, ARRAY['melancia', 'hidratante'], CURRENT_TIMESTAMP);

-- ============================================
-- LATICÍNIOS
-- ============================================

INSERT INTO "Food" ("id", "name", "category", "calories", "protein", "carbs", "fat", "fiber", "sodium", "common_portion", "common_portion_grams", "is_common", "is_brazilian", "tags", "created_at") VALUES
('leite_desnatado', 'Leite desnatado', 'dairy', 35, 3.4, 4.9, 0.2, 0, 51, '1 copo (200ml)', 200, true, true, ARRAY['leite', 'desnatado', 'magro'], CURRENT_TIMESTAMP),
('iogurte_natural_desnatado', 'Iogurte natural desnatado', 'dairy', 51, 4.8, 7.5, 0.2, 0, 62, '1 pote (170g)', 170, true, true, ARRAY['iogurte', 'natural', 'desnatado'], CURRENT_TIMESTAMP),
('queijo_cottage', 'Queijo cottage', 'dairy', 102, 12.5, 4.1, 4, 0, 350, '2 colheres de sopa', 50, true, true, ARRAY['queijo', 'cottage', 'magro'], CURRENT_TIMESTAMP),
('queijo_minas_frescal', 'Queijo minas frescal', 'dairy', 264, 17.4, 2.9, 21, 0, 396, '1 fatia', 30, true, true, ARRAY['queijo', 'minas', 'frescal'], CURRENT_TIMESTAMP),
('requeijao_light', 'Requeijão light', 'dairy', 158, 9, 5.6, 11, 0, 420, '1 colher de sopa', 20, true, true, ARRAY['requeijão', 'light'], CURRENT_TIMESTAMP);

-- ============================================
-- GORDURAS SAUDÁVEIS
-- ============================================

INSERT INTO "Food" ("id", "name", "category", "calories", "protein", "carbs", "fat", "fiber", "sodium", "common_portion", "common_portion_grams", "is_common", "is_brazilian", "tags", "created_at") VALUES
('azeite_de_oliva_extra_virgem', 'Azeite de oliva extra virgem', 'fat', 884, 0, 0, 100, 0, 2, '1 colher de sopa', 13, true, false, ARRAY['azeite', 'oliva', 'gordura', 'saudável'], CURRENT_TIMESTAMP),
('abacate_cru', 'Abacate, cru', 'fat', 96, 1.2, 6, 8.4, 6.3, 2, '1/2 unidade', 100, true, true, ARRAY['abacate', 'gordura', 'saudável'], CURRENT_TIMESTAMP),
('castanha_do_para', 'Castanha do Pará', 'nut_seed', 643, 14.5, 15, 63.5, 7.9, 1, '2 unidades', 10, true, true, ARRAY['castanha', 'oleaginosa', 'selênio'], CURRENT_TIMESTAMP),
('amendoim_torrado', 'Amendoim, torrado', 'nut_seed', 544, 27, 20, 44, 8, 8, '1 colher de sopa', 15, true, true, ARRAY['amendoim', 'oleaginosa'], CURRENT_TIMESTAMP),
('pasta_de_amendoim_integral', 'Pasta de amendoim integral', 'nut_seed', 588, 25, 18, 50, 7, 20, '1 colher de sopa', 16, true, true, ARRAY['amendoim', 'pasta', 'integral'], CURRENT_TIMESTAMP);

-- ============================================
-- BEBIDAS
-- ============================================

INSERT INTO "Food" ("id", "name", "category", "calories", "protein", "carbs", "fat", "fiber", "sodium", "common_portion", "common_portion_grams", "is_common", "is_brazilian", "tags", "created_at") VALUES
('cafe_coado_sem_acucar', 'Café, coado, sem açúcar', 'beverage', 4, 0.1, 0.8, 0, 0, 2, '1 xícara', 50, true, true, ARRAY['café', 'coado'], CURRENT_TIMESTAMP),
('agua_de_coco', 'Água de coco', 'beverage', 22, 0.4, 5.5, 0.1, 0.1, 25, '1 copo', 200, true, true, ARRAY['água', 'coco', 'hidratante'], CURRENT_TIMESTAMP);

-- ============================================
-- VERIFICAÇÃO
-- ============================================

SELECT COUNT(*) as total_alimentos FROM "Food";
SELECT 'Alimentos inseridos com sucesso!' as status;
