import React, { useState, useEffect } from 'react'
import {
  Box,
  List,
  ListItemText,
  ListItemSecondaryAction,
  ListItemButton,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Menu,
  MenuItem,
  Divider,
  Collapse,
  Typography,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Send as SendIcon
} from '@mui/icons-material'
import { useCollectionStore } from '../../store/collectionStore'
import { CollectionEntity } from '../../../../main/core/types'

// 简单的请求接口定义
interface RequestEntity {
  id: number
  name: string
  url: string
  method: string
  collection_id: number
}

interface CollectionItemProps {
  collection: CollectionEntity
  requests: RequestEntity[]
  expanded: boolean
  onToggleExpand: () => void
  onEdit: (collection: CollectionEntity) => void
  onDelete: (collection: CollectionEntity) => void
  onRequestSelect?: (request: RequestEntity) => void
}

const CollectionItem: React.FC<CollectionItemProps> = ({
  collection,
  requests,
  expanded,
  onToggleExpand,
  onEdit,
  onDelete,
  onRequestSelect
}) => {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation()
    setMenuAnchor(event.currentTarget)
  }

  const handleMenuClose = (): void => {
    setMenuAnchor(null)
  }

  const handleEdit = (): void => {
    handleMenuClose()
    onEdit(collection)
  }

  const handleDelete = (): void => {
    handleMenuClose()
    onDelete(collection)
  }

  const getMethodColor = (
    method: string
  ): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (method?.toUpperCase()) {
      case 'GET':
        return 'success'
      case 'POST':
        return 'info'
      case 'PUT':
        return 'warning'
      case 'DELETE':
        return 'error'
      case 'PATCH':
        return 'secondary'
      default:
        return 'default'
    }
  }

  return (
    <>
      <ListItemButton onClick={onToggleExpand}>
        <ListItemText
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'medium' }}>
                {collection.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ({requests.length} 个请求)
              </Typography>
            </Box>
          }
          secondary={collection.description}
        />
        <ListItemSecondaryAction>
          <IconButton size="small" onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
          <IconButton size="small">{expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
        </ListItemSecondaryAction>
      </ListItemButton>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ pl: 4 }}>
          {requests.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 1, pl: 2 }}>
              暂无请求
            </Typography>
          ) : (
            <List dense>
              {requests.map((request) => (
                <ListItemButton
                  key={request.id}
                  onClick={() => onRequestSelect?.(request)}
                  sx={{ py: 0.5 }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          label={request.method}
                          size="small"
                          color={getMethodColor(request.method)}
                          variant="outlined"
                          sx={{ minWidth: 60 }}
                        />
                        <Typography variant="body2" sx={{ flex: 1 }}>
                          {request.name}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontFamily: 'monospace' }}
                      >
                        {request.url}
                      </Typography>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton size="small" onClick={() => onRequestSelect?.(request)}>
                      <SendIcon fontSize="small" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItemButton>
              ))}
            </List>
          )}
        </Box>
      </Collapse>

      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
        <MenuItem onClick={handleEdit}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          编辑
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          删除
        </MenuItem>
      </Menu>
    </>
  )
}

interface CollectionListProps {
  onRequestSelect?: (request: RequestEntity) => void
}

const CollectionList: React.FC<CollectionListProps> = ({ onRequestSelect }) => {
  const {
    collections,
    loading,
    error,
    fetchCollections,
    createCollection,
    updateCollection,
    deleteCollection
  } = useCollectionStore()
  const [requests, setRequests] = useState<Record<number, RequestEntity[]>>({})
  const [expandedCollections, setExpandedCollections] = useState<Set<number>>(new Set())

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [currentCollection, setCurrentCollection] = useState<CollectionEntity | null>(null)
  const [dialogName, setDialogName] = useState('')
  const [dialogDescription, setDialogDescription] = useState('')

  useEffect(() => {
    fetchCollections()
  }, [fetchCollections])

  // 获取集合的请求数据
  useEffect(() => {
    const fetchRequestsForCollections = async (): Promise<void> => {
      const requestsMap: Record<number, RequestEntity[]> = {}
      for (const collection of collections) {
        try {
          const collectionRequests = await window.api.request.getAll()
          const filteredRequests = (collectionRequests || []).filter(
            (req: RequestEntity) => req.collection_id === collection.id
          )
          requestsMap[collection.id] = filteredRequests
        } catch (error) {
          console.error(`Failed to fetch requests for collection ${collection.id}:`, error)
          requestsMap[collection.id] = []
        }
      }
      setRequests(requestsMap)
    }

    if (collections.length > 0) {
      fetchRequestsForCollections()
    }
  }, [collections])

  const handleToggleExpand = (collectionId: number): void => {
    const newExpanded = new Set(expandedCollections)
    if (newExpanded.has(collectionId)) {
      newExpanded.delete(collectionId)
    } else {
      newExpanded.add(collectionId)
    }
    setExpandedCollections(newExpanded)
  }

  const handleCreateCollection = async (): Promise<void> => {
    if (dialogName.trim()) {
      await createCollection(dialogName.trim(), dialogDescription.trim() || undefined)
      setCreateDialogOpen(false)
      setDialogName('')
      setDialogDescription('')
    }
  }

  const handleEditCollection = async (): Promise<void> => {
    if (currentCollection && dialogName.trim()) {
      await updateCollection(currentCollection.id, {
        name: dialogName.trim(),
        description: dialogDescription.trim() || undefined
      })
      setEditDialogOpen(false)
      setCurrentCollection(null)
    }
  }

  const handleDeleteCollection = async (): Promise<void> => {
    if (currentCollection) {
      await deleteCollection(currentCollection.id)
      setDeleteDialogOpen(false)
      setCurrentCollection(null)
    }
  }

  const handleCreateNewCollection = (): void => {
    setCurrentCollection(null)
    setDialogName('')
    setDialogDescription('')
    setCreateDialogOpen(true)
  }

  const handleEdit = (collection: CollectionEntity): void => {
    setCurrentCollection(collection)
    setDialogName(collection.name)
    setDialogDescription(collection.description || '')
    setEditDialogOpen(true)
  }

  const handleDelete = (collection: CollectionEntity): void => {
    setCurrentCollection(collection)
    setDeleteDialogOpen(true)
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    )
  }

  return (
    <>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6">集合管理</Typography>
        <Button
          startIcon={<AddIcon />}
          onClick={handleCreateNewCollection}
          variant="outlined"
          size="small"
        >
          新建集合
        </Button>
      </Box>

      <Divider />

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {collections.length === 0 ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              暂无集合，点击上方按钮创建新集合
            </Typography>
          </Box>
        ) : (
          <List>
            {collections.map((collection) => (
              <React.Fragment key={collection.id}>
                <CollectionItem
                  collection={collection}
                  requests={requests[collection.id] || []}
                  expanded={expandedCollections.has(collection.id)}
                  onToggleExpand={() => handleToggleExpand(collection.id)}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onRequestSelect={onRequestSelect}
                />
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>

      {/* 创建集合对话框 */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)}>
        <DialogTitle>创建集合</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="集合名称"
            fullWidth
            variant="standard"
            value={dialogName}
            onChange={(e) => setDialogName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="描述（可选）"
            fullWidth
            multiline
            rows={3}
            variant="standard"
            value={dialogDescription}
            onChange={(e) => setDialogDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>取消</Button>
          <Button onClick={handleCreateCollection} disabled={!dialogName.trim()}>
            创建
          </Button>
        </DialogActions>
      </Dialog>

      {/* 编辑集合对话框 */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>编辑集合</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="集合名称"
            fullWidth
            variant="standard"
            value={dialogName}
            onChange={(e) => setDialogName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="描述（可选）"
            fullWidth
            multiline
            rows={3}
            variant="standard"
            value={dialogDescription}
            onChange={(e) => setDialogDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>取消</Button>
          <Button onClick={handleEditCollection} disabled={!dialogName.trim()}>
            保存
          </Button>
        </DialogActions>
      </Dialog>

      {/* 删除确认对话框 */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>确认删除</DialogTitle>
        <DialogContent>
          确定要删除集合 &quot;{currentCollection?.name}&quot; 吗？
          <br />
          此操作将同时删除集合中的所有请求，且不可撤销。
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>取消</Button>
          <Button onClick={handleDeleteCollection} color="error">
            删除
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default CollectionList
