import { obterTitulo } from '../constants';
import { xpNecessarioPara } from '../utils/xp';

function Hud({ level, xp, animacaoLevel, somMudo, onAlternarSom }) {
  const xpNecessario = xpNecessarioPara(level);
  const porcentagemXp = Math.min(100, (xp / xpNecessario) * 100);

  return (
    <div className="hud-rpg">
      <button
        type="button"
        className="btn-som"
        onClick={onAlternarSom}
        aria-label={somMudo ? 'Ativar sons' : 'Silenciar sons'}
        title={somMudo ? 'Ativar sons' : 'Silenciar sons'}
      >
        {somMudo ? '🔇' : '🔊'}
      </button>

      <div className={`level-badge ${animacaoLevel ? 'level-up-anim' : ''}`}>
        <span>LVL</span>
        <strong>{level}</strong>
      </div>

      <div className="xp-container">
        <div className="xp-info">
          <span className="titulo-rpg">{obterTitulo(level)}</span>
          <span>
            {xp} / {xpNecessario} XP
          </span>
        </div>
        <div
          className="xp-bar-bg"
          role="progressbar"
          aria-valuenow={xp}
          aria-valuemin={0}
          aria-valuemax={xpNecessario}
          aria-valuetext={`${xp} de ${xpNecessario} XP`}
          aria-label="Experiência"
        >
          <div className="xp-bar-fill" style={{ width: `${porcentagemXp}%` }}></div>
        </div>
      </div>
    </div>
  );
}

export default Hud;
