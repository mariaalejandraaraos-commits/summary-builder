import { ChevronRight } from 'lucide-react'
import { useState } from 'react'

export type TaskBadgeColor = 'red' | 'gray' | 'green' | 'orange'

export type PublicationTask = {
  id: string
  text: string
  badge: {
    text: string
    color: TaskBadgeColor
  }
}

export type PublicationTaskGroup = {
  id: string
  title: string
  value: string
  description: string
  summaryBadge?: TaskBadgeColor
  hasNavigation: boolean
  tasks: PublicationTask[]
  defaultExpanded?: boolean
  hideTasksUntilExpanded?: boolean
  showDetailsAction?: boolean
  detailsLabel?: string
  fallback?: boolean
  fallbackStyle?: 'inline' | 'panel'
}

type TasksCardProps = {
  title: string
  groups: PublicationTaskGroup[]
  showTitle: boolean
  compact: boolean
  shortContainer?: boolean
  onNavigate: (label: string) => void
  onRetry: (groupId: string) => void
}

export function TasksCard({
  title,
  groups,
  showTitle,
  compact,
  shortContainer = false,
  onNavigate,
  onRetry,
}: TasksCardProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => new Set(groups.filter((group) => group.defaultExpanded).map((group) => group.id)))

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((current) => {
      const next = new Set(current)
      if (next.has(groupId)) next.delete(groupId)
      else next.add(groupId)
      return next
    })
  }

  return (
    <article className={`publication-tasks-card ${compact ? 'publication-tasks-card--compact' : ''} ${shortContainer ? 'publication-tasks-card--short' : ''}`} aria-label={title}>
      {showTitle && <h3 className="publication-tasks-card__title">{title || 'Sin título'}</h3>}
      <div className="publication-tasks-card__list">
        {groups.map((group) => {
          const isEmpty = group.value === '0'
          const isExpanded = expandedGroups.has(group.id)
          const expandableTasks = group.tasks.filter((task) => task.badge.color === 'gray')
          const visibleTasks = group.tasks.filter((task) => task.badge.color !== 'gray')
          const showTasks = group.hideTasksUntilExpanded
            ? isExpanded
            : visibleTasks.length > 0 || (isExpanded && expandableTasks.length > 0)
          const headerTitle = compact ? group.description : group.title
          const headerContent = (
            <div className="task-subcard__header-row">
              <span className="task-subcard__title">
                {headerTitle}
                {group.summaryBadge === 'red' && !isEmpty && !group.fallback && (
                  <span className="task-subcard__dot" aria-label="Requiere atención" />
                )}
              </span>
              {!group.fallback && (group.hasNavigation || isEmpty) && (
                <span className="task-subcard__header-end">
                  {isEmpty && <span className="task-subcard__empty-pill">0</span>}
                  {group.hasNavigation && <ChevronRight aria-hidden="true" size={16} strokeWidth={2} />}
                </span>
              )}
            </div>
          )

          return (
            <section className="task-subcard" key={group.id}>
              {group.hasNavigation && !group.fallback ? (
                <button className="task-subcard__header" type="button" onClick={() => onNavigate(group.title)} aria-label={`Abrir ${group.title}`}>
                  {headerContent}
                </button>
              ) : (
                <div className="task-subcard__header">{headerContent}</div>
              )}

              {group.fallback ? (
                <div className={`task-subcard__fallback ${group.fallbackStyle === 'panel' ? 'task-subcard__fallback--panel' : ''}`}>
                  <span>{group.fallbackStyle === 'panel' ? 'No pudimos mostrar estos datos' : 'No pudimos mostrar estos datos.'}</span>
                  <button type="button" onClick={() => onRetry(group.id)}>Reintentar</button>
                </div>
              ) : !isEmpty && (
                <>
                  <div className="task-subcard__metric">
                    <strong>{group.value || '0'}</strong>
                    {!compact && <span>{group.description}</span>}
                  </div>

                  {showTasks && (
                    <div className="task-subcard__tasks">
                      {[...visibleTasks, ...expandableTasks].map((task) => {
                        const hidden = task.badge.color === 'gray' && !isExpanded
                        return (
                          <button
                            className={`task-subcard__task ${hidden ? 'task-subcard__task--hidden' : ''}`}
                            type="button"
                            key={task.id}
                            aria-hidden={hidden}
                            tabIndex={hidden ? -1 : 0}
                            onClick={() => onNavigate(task.text)}
                          >
                            <span>{task.text}</span>
                            <span className={`task-subcard__badge task-subcard__badge--${task.badge.color}`}>{task.badge.text}</span>
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {expandableTasks.length > 0 && (
                    <div className="task-subcard__footer">
                      <button
                        type="button"
                        onClick={() => toggleGroup(group.id)}
                        aria-expanded={isExpanded}
                      >
                        {group.showDetailsAction ? isExpanded ? 'Ver menos' : group.detailsLabel ?? 'Más detalle' : isExpanded ? 'Ver menos' : 'Ver más'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </section>
          )
        })}
      </div>
    </article>
  )
}
